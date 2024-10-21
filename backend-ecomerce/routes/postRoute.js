// routes/postRoutes.js

const express = require("express");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { verifyUser } = require("../middleware/middleware");

const router = express.Router();

// Route để tạo bài viết mới
router.post("/", verifyUser, createPost);

// Route để lấy tất cả bài viết
router.get("/", getPosts);

// Route để lấy bài viết theo ID
router.get("/:id", getPostById);

// Route để cập nhật bài viết
router.put("/:id", verifyUser, updatePost);

// Route để xóa bài viết
router.delete("/:id", verifyUser, deletePost);

module.exports = router;
