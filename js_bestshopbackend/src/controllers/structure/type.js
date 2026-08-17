const { get_query_database, post_query_database } = require("../../config/database_utlis");

exports.get_type = async (req, res) => {
  const occasion = req.query.occasion;
  if (!occasion) {
    return res.status(400).json({ error: "occasion is required in query" });
  }
  try {
    const query = `SELECT id, type_name AS name FROM type WHERE occasion = ? AND status = '1'`;
    const types = await get_query_database(query, [occasion]);
    res.json(types);
  } catch (err) {
    console.error("Error fetching types:", err);
    res.status(500).json({ error: "Error fetching types" });
  }
};

exports.post_type = async (req, res) => {
  const { occasion, name } = req.body;
  if (!occasion || !name) {
    return res.status(400).json({ error: "occasion and name are required" });
  }
  try {
    const formatted_name = name.toUpperCase();
    const query = `INSERT INTO type (occasion, type_name) VALUES (?, ?)`;
    const success_message = await post_query_database(query, [occasion, formatted_name], "Type added successfully");
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error adding type:", err);
    res.status(500).json({ error: "Error adding type" });
  }
};

exports.update_type = async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: "id and name are required" });
  }
  try {
    const formatted_name = name.toUpperCase();
    const query = `UPDATE type SET type_name = ? WHERE id = ?`;
    const success_message = await post_query_database(query, [formatted_name, id], "Type updated successfully");
    res.json(success_message);
  } catch (err) {
    console.error("Error updating type:", err);
    res.status(500).json({ error: "Error updating type" });
  }
};

exports.delete_type = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  try {
    const query = `UPDATE type SET status = '0' WHERE id = ?`;
    const success_message = await post_query_database(query, [id], "Type deleted successfully");
    res.json(success_message);
  } catch (err) {
    console.error("Error deleting type:", err);
    res.status(500).json({ error: "Error deleting type" });
  }
};
