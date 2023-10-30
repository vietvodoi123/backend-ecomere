const express = require("express");
const router = express.Router();
const {
  addToCart,
  updateCartStatus,
  getAllCartsForUser,
} = require("../controllers/cartControllers");

const { verifyUser } = require("../middleware/middleware");

// Tạo cart mới hoặc cập nhật cart có sẵn
router.route("/").post([verifyUser], addToCart);

// Cập nhật trạng thái cart và số lượng đã bán của sản phẩm
router.route("/:cart_id").put([verifyUser], updateCartStatus);

// Lấy tất cả các cart của một người dùng dựa trên user_id
router.route("/").get([verifyUser], getAllCartsForUser);

module.exports = router;
