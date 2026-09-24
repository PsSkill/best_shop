const bcrypt = require("bcrypt");
const { get_query_database } = require("../../config/database_utlis");
const jwt = require("jsonwebtoken");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

exports.post_login = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({
            err: "name and password are required",
        });
    }
    try {
        const query = `SELECT u.id, u.location, u.name, u.password, u.role, r.name AS role_name
                       FROM master_user u
                       LEFT JOIN master_roles r ON u.role = r.id
                       WHERE u.name = ? AND u.status = '1'`;
        const [user_detail] = await get_query_database(query, [name]);
        if (!user_detail) {
            return res.status(404).json({ err: "User not found" });
        }
        // Decrypting the password
        const is_password_valid = await bcrypt.compare(
            password,
            user_detail.password
        );
        
        if (!is_password_valid) {
            return res.status(401).json({ err: "Invalid password" });
        }

        const roleName = user_detail.role_name || (user_detail.role === 4 || user_detail.name.toLowerCase() === 'admin' ? 'Admin' : 'Staff');
        const isAdmin = (roleName || '').toLowerCase() === 'admin' || user_detail.role === 4 || user_detail.name.toLowerCase() === 'admin';

        // Preparing payload for JWT
        const token_payload = {
            id: user_detail.id,
            location: user_detail.location,
            role: user_detail.role,
            role_name: roleName,
            is_admin: isAdmin,
        };
        const token = jwt.sign(token_payload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        delete user_detail.password;
        return res
            .status(200)
            .json({
                message: "Login successful",
                token: token,
                username: user_detail.name,
                role: user_detail.role,
                role_name: roleName,
                is_admin: isAdmin
            });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: "Internal server error" });
    }
};
