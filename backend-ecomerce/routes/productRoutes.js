const express = require("express");
const {
  getAllProducts,
  getProductById,
  addProduct,
} = require("../controllers/productControllers");

const router = express.Router();

router.post("/", addProduct);
// Lấy tất cả sản phẩm
router.get("/", getAllProducts);

// Lấy sản phẩm theo ID
router.get("/:id", getProductById);

module.exports = router;
