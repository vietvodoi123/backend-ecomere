const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến sản phẩm bằng ObjectId
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến người dùng bằng ObjectId
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Mặc định là ngày hiện tại khi tạo đánh giá/nhận xét
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
