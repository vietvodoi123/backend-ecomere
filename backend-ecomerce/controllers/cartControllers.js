const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Lấy giỏ hàng của người dùng
exports.getCartItems = async (req, res) => {
  try {
    // Lấy giỏ hàng của người dùng đã đăng nhập
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product_id"
    );

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy giỏ hàng.",
      error: error.message,
    });
  }
};

// Thêm hoặc cập nhật sản phẩm trong giỏ hàng
exports.addOrUpdateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Sản phẩm hoặc số lượng không hợp lệ." });
    }

    // Tìm hoặc tạo giỏ hàng mới cho người dùng
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ hàng
      cart.items.push({ product: productId, quantity });
    }

    // Lưu giỏ hàng
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi thêm hoặc cập nhật sản phẩm trong giỏ hàng.",
      error: error.message,
    });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id } = req.params;

    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    // Tìm và loại bỏ sản phẩm khỏi giỏ hàng
    const newItems = cart.items.filter(
      (item) => item.product.toString() !== item_id
    );

    if (newItems.length === cart.items.length) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
    }

    cart.items = newItems;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng.",
      error: error.message,
    });
  }
};
