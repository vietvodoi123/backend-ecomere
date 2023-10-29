const express = require("express");
const router = express.Router();

const {
  createCart,
  getCartByUser,
  addItemToCart,
  updateCartStatus,
  updateCartItem,
  removeItemFromCart,
} = require("../controller/cartController");
const { verifyUser } = require("../middleware/middleware");

// Để sử dụng middleware xác thực, hãy thêm authMiddleware vào các tuyến đường cần xác thực người dùng.

// Lấy giỏ hàng của người dùng
router.get("/", verifyUser, getCartByUser);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", verifyUser, addItemToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update/:productId", verifyUser, updateCartItem);

// Xoá sản phẩm khỏi giỏ hàng
router.delete("/remove/:productId", verifyUser, removeItemFromCart);

// Cập nhật trạng thái đơn hàng
router.put("/update-order/:cartId", verifyUser, updateCartStatus);

module.exports = router;
