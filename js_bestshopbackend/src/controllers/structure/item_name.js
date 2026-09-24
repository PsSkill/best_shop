const { get_query_database, post_query_database } = require("../../config/database_utlis");

exports.get_item_name = async (req, res) => {
  const category = req.query.category;

  try {
    let query = `
      SELECT MIN(id) AS id, name, MAX(image_path) AS image_path
      FROM item_name
      WHERE status = '1'
    `;
    const params = [];

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    query += ` GROUP BY name`;

    const item_names = await get_query_database(query, params);
    res.json(item_names);
  } catch (err) {
    console.error("Error fetching item names:", err);
    res.status(500).json({ error: "Error fetching item names" });
  }
};

exports.post_item_name = async (req, res) => {
  const { category, name, image_path } = req.body;

  if (!category || !name) {
    return res.status(400).json({
      error: "category and name are required",
    });
  }

  try {
    const formatted_name = name.toUpperCase();
    const query = `
      INSERT INTO item_name (category, name, image_path)
      VALUES (?, ?, ?)
    `;

    const success_message = await post_query_database(
      query,
      [category, formatted_name, image_path],
      "Item name added successfully"
    );
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error adding item name:", err);
    res.status(500).json({ error: "Error adding item name" });
  }
};

exports.update_item_name = async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({
      error: "id and name are required",
    });
  }

  try {
    const formatted_name = name.toUpperCase();
    const query = `
      UPDATE item_name
      SET name = ?
      WHERE id = ?
    `;

    const success_message = await post_query_database(
      query,
      [formatted_name, id],
      "Item name updated successfully"
    );
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error updating item name:", err);
    res.status(500).json({ error: "Error updating item name" });
  }
};

exports.delete_item_name = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: "ID is required",
    });
  }

  try {
    const query = `
      UPDATE item_name
      SET status = '0'
      WHERE id = ?
    `;

    const success_message = await post_query_database(
      query,
      [id],
      "Item name deleted successfully"
    );
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error deleting item name:", err);
    res.status(500).json({ error: "Error deleting item name" });
  }
};
