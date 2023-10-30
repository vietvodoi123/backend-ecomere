const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
} = require("../controllers/productControllers");

// Lấy tất cả sản phẩm
router.get("/", getAllProducts);

// Lấy sản phẩm theo ID
router.get("/:id", getProductById);

module.exports = router;
