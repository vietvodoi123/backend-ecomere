const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, // Lưu trữ nội dung markdown dưới dạng chuỗi
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Liên kết với model User
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Tự động lưu thời gian tạo
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Tự động lưu thời gian cập nhật
  },
  // slug: {
  //   type: String, // URL thân thiện với SEO
  //   unique: true,
  //   required: true,
  // },
  status: {
    type: String,
    enum: ["draft", "published", "deleted"], // Trạng thái bài viết
    default: "draft",
  },
  views: {
    type: Number,
    default: 0, // Số lượt xem
  },
  likes: {
    type: Number,
    default: 0, // Số lượt thích
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
