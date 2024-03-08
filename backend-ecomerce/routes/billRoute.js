const express = require("express");
const router = express.Router();
const {
  createBill,
  updateBill,
  getAllBillsByUser,
  getAllBillsBySeller,
} = require("../controllers/BillController");
const { verifyUser } = require("../middleware/middleware");

// Route để tạo mới một đơn hàng
router.route("/").post([verifyUser], createBill);

// Route để cập nhật thông tin của một đơn hàng
router.route("/:id").put([verifyUser], updateBill);

// Route để lấy tất cả đơn hàng của một người dùng
router.route("/user/:buyerId").get([verifyUser], getAllBillsByUser);

// Route để lấy tất cả đơn hàng của một người bán với các tùy chọn
router.route("/seller/:sellerId").get([verifyUser], getAllBillsBySeller);

module.exports = router;
