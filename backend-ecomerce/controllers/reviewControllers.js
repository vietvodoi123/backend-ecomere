const Review = require("../models/Review");

// Lấy tất cả bình luận của sản phẩm từ mới đến cũ
const getAllProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Lấy tất cả bình luận của sản phẩm dựa trên product_id và sắp xếp theo ngày
    const reviews = await Review.find({ product_id }).sort({ date: -1 });

    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả bình luận của tôi từ mới đến cũ
const getAllMyReviews = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Lấy tất cả bình luận của người dùng dựa trên user_id và sắp xếp theo ngày
    const reviews = await Review.find({ user_id }).sort({ date: -1 });

    res.status(200).json({ data: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm một bình luận
const addReview = async (req, res) => {
  try {
    const { product_id, user_id, rating, comment } = req.body;

    const review = new Review({
      product_id,
      user_id,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Bình luận đã được thêm." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sửa bình luận
const editReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(review_id);

    if (!review) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({ message: "Bình luận đã được cập nhật." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa bình luận
const deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await Review.findById(review_id);

    if (!review) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    await review.remove();

    res.status(200).json({ message: "Bình luận đã được xóa." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProductReviews,
  getAllMyReviews,
  addReview,
  editReview,
  deleteReview,
};
