const express = require("express");
const router = express.Router();
const {
  createBill,
  updateBill,
  getAllBillsByUser,
  getAllBillsBySeller,
  getBillById,
} = require("../controllers/BillController");
const { verifyUser } = require("../middleware/middleware");

// Route để tạo mới một đơn hàng
router.route("/").post([verifyUser], createBill);

// route để lấy thông tin của 1 đơn hàng
router.route("/:id").get([verifyUser], getBillById);

// Route để cập nhật thông tin của một đơn hàng
router.route("/:id").put([verifyUser], updateBill);

// Route để lấy tất cả đơn hàng của một người dùng
router.route("/user/ibuy").get([verifyUser], getAllBillsByUser);

// Route để lấy tất cả đơn hàng của một người bán với các tùy chọn
router.route("/seller/isell").get([verifyUser], getAllBillsBySeller);

module.exports = router;
