const {
  get_query_database,
  post_query_database,
} = require("../../config/database_utlis");

exports.get_brand = async (req, res) => {
  const sub_category = req.query.sub_category;

  try {
    let query = `
      SELECT MIN(id) AS id, name, MAX(image_path) AS image_path
      FROM brand
      WHERE status = '1'
    `;
    const params = [];

    if (sub_category) {
      query += ` AND sub_category = ?`;
      params.push(sub_category);
    }

    query += ` GROUP BY name`;

    const brands = await get_query_database(query, params);
    res.json(brands);
  } catch (err) {
    console.error("Error fetching brand:", err);
    res.status(500).json({ error: "Error fetching brand" });
  }
};

exports.post_brand = async (req, res) => {
  const { sub_category, name, image_path } = req.body;

  if (!sub_category || !name) {
    return res.status(400).json({
      error: "sub_category and name are required",
    });
  }

  try {
    const formatted_name = name.toUpperCase();
    const query = `
      INSERT INTO brand (sub_category, name, image_path)
      VALUES (?, ?, ?)
    `;

    const success_message = await post_query_database(
      query,
      [sub_category, formatted_name, image_path],
      "Brand added successfully"
    );
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error adding brand:", err);
    res.status(500).json({ error: "Error adding brand" });
  }
};

exports.update_brand = async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({
      error: "id and name are required",
    });
  }

  try {
    const formatted_name = name.toUpperCase();
    const query = `
      UPDATE brand
      SET name = ?
      WHERE id = ?
    `;

    const success_message = await post_query_database(
      query,
      [formatted_name, id],
      "Brand updated successfully"
    );
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error updating brand:", err);
    res.status(500).json({ error: "Error updating brand" });
  }
};

exports.delete_brand = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: "ID is required",
    });
  }

  try {
    const query = `
      UPDATE brand
      SET status = '0'
      WHERE id = ?
    `;

    const success_message = await post_query_database(
      query,
      [id],
      "Brand deleted successfully"
    );
    res.json({ message: success_message });
  } catch (err) {
    console.error("Error deleting brand:", err);
    res.status(500).json({ error: "Error deleting brand" });
  }
};
