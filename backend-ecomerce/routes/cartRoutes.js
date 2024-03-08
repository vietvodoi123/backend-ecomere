const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartItems,
  updateItemInCart,
  deleteItemInCart,
} = require("../controllers/cartControllers");

const { verifyUser } = require("../middleware/middleware");

// Tạo cart mới hoặc cập nhật cart có sẵn
router.route("/").post([verifyUser], addToCart);
router.route("/:user_id").get([verifyUser], getCartItems);
router.route("/:user_id/:item_id").delete([verifyUser], deleteItemInCart);
router.route("/:user_id/:item_id").put([verifyUser], updateItemInCart);

module.exports = router;
