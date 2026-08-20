const express = require("express");

const shop_location = require("../../controllers/master/shop_location");
const role = require("../../controllers/master/role");
const product_masters = require("../../controllers/master/product_masters");

const router = express.Router();

router.get("/shop-location", shop_location.get_shop_location);
router.post("/shop-location", shop_location.post_shop_location);
router.put("/shop-location", shop_location.update_shop_location);
router.delete("/shop-location", shop_location.delete_shop_location);

router.get("/role", role.get_role);
router.post("/role", role.post_role);
router.put("/role", role.update_role);
router.delete("/route", role.delete_role);

// Product master tables GET APIs
router.get("/category", product_masters.get_master_categories);
router.get("/brand", product_masters.get_master_brands);
router.get("/color", product_masters.get_master_colors);
router.get("/item-name", product_masters.get_master_item_names);
router.get("/model", product_masters.get_master_models);
router.get("/occasion", product_masters.get_master_occasions);
router.get("/sub-category", product_masters.get_master_sub_categories);
router.get("/type", product_masters.get_master_types);
router.get("/size",product_masters.get_master_size)

module.exports = router;
