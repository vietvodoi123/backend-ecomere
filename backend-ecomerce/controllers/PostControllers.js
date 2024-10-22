// controllers/postController.js

const Post = require("../models/Post"); // Giả sử bạn đã định nghĩa model Post trong models/Post.js

// Tạo bài viết mới
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({ title, content, author: req.user.id });
    await newPost.save();
    res.status(201).json({
      message: "Đăng bài viết thành công !",
      newPost: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi tạo bài viết.",
      error: error.message,
    });
  }
};
exports.getPosts = async (req, res) => {
  const { page = 1, limit = 10, search = "", author } = req.query;
  try {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const skip = (pageNum - 1) * limitNum;

    const filter = {
      title: { $regex: search, $options: "i" },
    };

    if (author) {
      filter.author = author;
    }

    const posts = await Post.find(filter).skip(skip).limit(limitNum);
    const totalPosts = await Post.countDocuments(filter);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limitNum), // Tổng số trang
      currentPage: pageNum, // Trang hiện tại
      totalPosts, // Tổng số bài viết
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách bài viết.",
      error: error.message,
    });
  }
};

// Lấy bài viết theo ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy bài viết.",
      error: error.message,
    });
  }
};
// Cập nhật bài viết
exports.updatePost = async (req, res) => {
  try {
    // Tìm bài viết theo ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tìm thấy." });
    }

    // Kiểm tra xem người dùng có phải là tác giả của bài viết không
    if (post.author.toString() !== req.user.id) {
      // authorId từ body hoặc token của người dùng
      return res
        .status(403)
        .json({ message: "Bạn không có quyền cập nhật bài viết này." });
    }

    // Cập nhật bài viết
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi cập nhật bài viết.",
      error: error.message,
    });
  }
};

// Xóa bài viết
exports.deletePost = async (req, res) => {
  try {
    // Tìm bài viết theo ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tìm thấy." });
    }

    // Kiểm tra xem người dùng có phải là tác giả của bài viết không
    if (post.author.toString() !== req.user.id) {
      // authorId từ body hoặc token của người dùng
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa bài viết này." });
    }

    // Xóa bài viết
    await Post.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi xóa bài viết.",
      error: error.message,
    });
  }
};
