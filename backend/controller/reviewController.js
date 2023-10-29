const Review = require("../model/Review");

// Tạo đánh giá/nhận xét mới
const createReview = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    const review = new Review({
      product_id,
      user_id,
      rating,
      comment,
    });

    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tất cả đánh giá/nhận xét cho một sản phẩm cụ thể
const getReviewsForProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const reviews = await Review.find({ product_id });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy đánh giá/nhận xét theo ID
const getReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa đánh giá/nhận xét theo ID
const deleteReviewById = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await Review.findByIdAndRemove(reviewId);

    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Lấy tất cả đánh giá/nhận xét của một người dùng
const getReviewsByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id; // Thay thế bằng cách lấy user_id từ request

    const reviews = await Review.find({ user_id });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createReview,
  getReviewsForProduct,
  getReviewById,
  deleteReviewById,
  getReviewsByUser,
};
