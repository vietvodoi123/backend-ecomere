const express = require("express");
const router = express.Router();
const {
  addOrUpdateCartItem,
  getCartItems,
  deleteCartItem,
} = require("../controllers/cartControllers");

const { verifyUser } = require("../middleware/middleware");

// Lấy giỏ hàng của người dùng
router.route("/").get([verifyUser], getCartItems);

// Thêm hoặc cập nhật sản phẩm trong giỏ hàng
router.route("/").put([verifyUser], addOrUpdateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.route("/:item_id").delete([verifyUser], deleteCartItem);

module.exports = router;
