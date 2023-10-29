const express = require("express");
const {
  createReview,
  getReviewsForProduct,
  deleteReviewById,
  getReviewById,
  getReviewsByUser,
} = require("../controller/reviewController");
const { verifyUser } = require("../middleware/middleware");

const reviewRouter = express.Router();

// Tạo đánh giá/nhận xét mới
reviewRouter.route("/").post([verifyUser], createReview);

//  lấy tất cả review của tôi
reviewRouter.route("/user/:user_id").get([verifyUser], getReviewsByUser);

// Lấy tất cả đánh giá/nhận xét cho một sản phẩm cụ thể
reviewRouter.get("/product/:product_id", getReviewsForProduct);

// Lấy đánh giá/nhận xét theo ID
reviewRouter.get("/:id", getReviewById);

// Xóa đánh giá/nhận xét theo ID
reviewRouter.delete("/:id", deleteReviewById);

module.exports = reviewRouter;
