const Review = require("../models/Review");
const Product = require("../models/Product");

const calcRatingProdduct = async (product_id) => {
  // Tính toán lại chỉ số rate của sản phẩm
  const product = await Product.findById(product_id);
  if (product) {
    const totalReviews = await Review.countDocuments({ product_id });
    const totalRating = await Review.aggregate([
      { $match: { product_id } },
      { $group: { _id: null, total: { $sum: "$rating" } } },
    ]);

    product.rating = totalRating[0]?.total / totalReviews;
    await product.save();
  }
};

// Lấy tất cả bình luận của sản phẩm từ mới đến cũ
const getAllProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;
    let { page, pageSize } = req.query;

    if (!page) page = 1;
    if (!pageSize) pageSize = 10;

    const reviews = await Review.find({ product_id })
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .populate("user_id", "name avatar"); // Thêm populate để lấy thông tin người đánh giá

    res.status(200).json({ data: reviews, matadata: { page, pageSize } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sửa phần getAllMyReviews trong review controller
const getAllMyReviews = async (req, res) => {
  try {
    const { user_id } = req.params;
    let { page, pageSize } = req.query;

    if (!page) page = 1;
    if (!pageSize) pageSize = 10;

    const reviews = await Review.find({ user_id })
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .populate("product_id", "name imageUrl"); // Thêm populate để lấy thông tin sản phẩm

    res.status(200).json({ data: reviews, matadata: { page, pageSize } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm vào phần addReview trong review controller
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
    calcRatingProdduct();

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
