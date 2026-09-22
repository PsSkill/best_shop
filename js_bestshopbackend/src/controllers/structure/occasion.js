const { get_query_database, post_query_database } = require("../../config/database_utlis");

exports.get_occasion = async (req, res) => {
  const size = req.query.size;
  try {
    let query, params;
    if (size) {
      query = `SELECT id, occasion_name AS name FROM occasion WHERE size = ? AND status = '1'`;
      params = [size];
    } else {
      query = `SELECT id, occasion_name AS name FROM occasion WHERE status = '1'`;
      params = [];
    }
    const occasions = await get_query_database(query, params);
    res.json(occasions);
  } catch (err) {
    console.error("Error fetching occasions:", err);
    res.status(500).json({ error: "Error fetching occasions" });
  }
};

exports.post_occasion = async (req, res) => {
  const { size, name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  try {
    const formatted_name = name.toUpperCase();
    let sizeVal = size;
    if (!sizeVal || sizeVal === "0" || sizeVal === 0) {
      const existingSizes = await get_query_database("SELECT id FROM size WHERE status = '1' ORDER BY id DESC LIMIT 1");
      if (existingSizes && existingSizes.length > 0) {
        sizeVal = existingSizes[0].id;
      }
    }
    const query = `INSERT INTO occasion (size, occasion_name) VALUES (?, ?)`;
    const success_message = await post_query_database(query, [sizeVal, formatted_name], "Occasion added successfully");
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error adding occasion:", err);
    res.status(500).json({ error: "Error adding occasion" });
  }
};

exports.update_occasion = async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: "id and name are required" });
  }
  try {
    const formatted_name = name.toUpperCase();
    const query = `UPDATE occasion SET occasion_name = ? WHERE id = ?`;
    const success_message = await post_query_database(query, [formatted_name, id], "Occasion updated successfully");
    res.json(success_message);
  } catch (err) {
    console.error("Error updating occasion:", err);
    res.status(500).json({ error: "Error updating occasion" });
  }
};

exports.delete_occasion = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const query = `UPDATE occasion SET status = '0' WHERE id = ?`;
    const success_message = await post_query_database(query, [id], "Occasion deleted successfully");
    res.json(success_message);
  } catch (err) {
    console.error("Error deleting occasion:", err);
    res.status(500).json({ error: "Error deleting occasion" });
  }
};
