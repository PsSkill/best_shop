const { get_query_database } = require("../../config/database_utlis");

exports.get_master_categories = async (req, res) => {
  try {
    const query = `SELECT id, category_name FROM master_category WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master categories:", err);
    res.status(500).json({ error: "Error fetching master categories" });
  }
};

exports.get_master_brands = async (req, res) => {
  try {
    const query = `SELECT id, brand_name FROM master_brand WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master brands:", err);
    res.status(500).json({ error: "Error fetching master brands" });
  }
};

exports.get_master_colors = async (req, res) => {
  try {
    const query = `SELECT id, color_name FROM master_color WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master colors:", err);
    res.status(500).json({ error: "Error fetching master colors" });
  }
};

exports.get_master_item_names = async (req, res) => {
  try {
    const query = `SELECT id, item_name FROM master_item_name WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master item names:", err);
    res.status(500).json({ error: "Error fetching master item names" });
  }
};

exports.get_master_models = async (req, res) => {
  try {
    const query = `SELECT id, model_name FROM master_model WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master models:", err);
    res.status(500).json({ error: "Error fetching master models" });
  }
};

exports.get_master_occasions = async (req, res) => {
  try {
    const query = `SELECT id, occasion_name FROM master_occasion WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master occasions:", err);
    res.status(500).json({ error: "Error fetching master occasions" });
  }
};

exports.get_master_sub_categories = async (req, res) => {
  try {
    const query = `SELECT id, sub_category_name FROM master_sub_category WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master sub categories:", err);
    res.status(500).json({ error: "Error fetching master sub categories" });
  }
};

exports.get_master_types = async (req, res) => {
  try {
    const query = `SELECT id, type_name FROM master_type WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master types:", err);
    res.status(500).json({ error: "Error fetching master types" });
  }
};

exports.get_master_size = async (req, res) => {
  try {
    const query = `SELECT id, size_name FROM master_size WHERE status = '1'`;
    const data = await get_query_database(query);
    res.json(data);
  } catch (err) {
    console.error("Error fetching master size:", err);
    res.status(500).json({ error: "Error fetching master size" });
  }
};
