const { get_query_database } = require("../../config/database_utlis");
exports.get_products = async (req, res) => {
  try {
    const query = `
    SELECT 
    item_name.id AS id,
    category.image_path AS category_image,
    category.name AS category_name,
    item_name.name AS item_name,
    COALESCE(SUM(stock.quantity), 0) AS count
FROM
    item_name
LEFT JOIN
    category ON item_name.category = category.id

LEFT JOIN
    stock ON item_name.id = stock.item_name
GROUP BY 
    id,
    category_image,
    item_name;
 `;
    const products = await get_query_database(query);
    res.json(products);
  } catch (error) {
    console.error(`Error fetching item name and image: ${error.message}`);
    res.status(500).json({ erro: "Error fetching item name and image" });
  }
};
