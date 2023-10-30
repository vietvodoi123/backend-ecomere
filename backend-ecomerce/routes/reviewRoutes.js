const express = require("express");
const router = express.Router();
const {
  getAllProductReviews,
  getAllMyReviews,
  addReview,
  editReview,
  deleteReview,
} = require("../controllers/reviewControllers");
const { verifyUser } = require("../middleware/middleware");

// Lấy tất cả bình luận của sản phẩm từ mới đến cũ
router.get("/", getAllProductReviews);

// Lấy tất cả bình luận của tôi từ mới đến cũ
router.get("/", verifyUser, getAllMyReviews);

// Thêm một bình luận mới
router.post("/", verifyUser, addReview);

// Sửa bình luận
router.put("/:review_id", verifyUser, editReview);

// Xóa bình luận
router.delete("/:review_id", verifyUser, deleteReview);

module.exports = router;
