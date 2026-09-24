const jwt = require("jsonwebtoken");
const { get_query_database } = require("../config/database_utlis");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const is_token_revoked = async (token) => {
    const query = "SELECT * FROM revoked_tokens WHERE token = ?";
    const [result] = await get_query_database(query, [token]);
    return result
};

const authenticate_token = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (await is_token_revoked(token)) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Token is revoked" });
        }
        const query = `SELECT u.id, u.name, u.role, u.location, r.name AS role_name 
                       FROM master_user u 
                       LEFT JOIN master_roles r ON u.role = r.id 
                       WHERE u.id = ? AND u.status = '1'`;
        const [user] = await get_query_database(query, [decoded.id]);

        if (!user) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid token" });
        }

        const isAdmin = user.role === 4 || (user.role_name || '').toLowerCase() === 'admin' || user.name.toLowerCase() === 'admin';
        req.user = {
            id: user.id,
            name: user.name,
            role: user.role,
            role_name: user.role_name,
            location: user.location,
            is_admin: isAdmin,
        };
        req.body.user_id = user.id;
        if (!req.body.location) {
            req.body.location = user.location;
        }
        next();
    } catch (err) {
        console.error("Authentication error:", err);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
module.exports = authenticate_token;
