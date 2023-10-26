const Cart = require("../model/Cart");
const Product = require("../model/Products");

// Lấy giỏ hàng của một người dùng
const getCartByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
const addItemToCart = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { product_id, quantity } = req.body;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tìm xem sản phẩm đã có trong giỏ hàng chưa
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id === product_id
    );

    if (itemIndex === -1) {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
      cart.items.push({ product_id, quantity });
    } else {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      cart.items[itemIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeItemFromCart = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const product_id = req.params.product_id;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Loại bỏ sản phẩm khỏi giỏ hàng
    cart.items = cart.items.filter((item) => item.product_id !== product_id);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Hàm để cập nhật số lượng sản phẩm đã bán
const updateSoldCount = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (product) {
      product.soldCount += quantity;
      await product.save();
    }
  } catch (error) {
    // Xử lý lỗi nếu cần
  }
};
// Tạo giỏ hàng mới
const createCart = async (req, res) => {
  try {
    const { user_id, items } = req.body;
    const cart = new Cart({ user_id, items });
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller để cập nhật trạng thái đơn hàng và số lượng sản phẩm đã bán
const updateCartStatus = async (req, res) => {
  try {
    const { cartId, status } = req.body;

    // Cập nhật trạng thái đơn hàng
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { status },
      { new: true }
    );

    // Nếu đơn hàng đã giao thành công hoặc đã thanh toán
    if (status === "delivered" || status === "paid") {
      // Duyệt qua từng mục trong đơn hàng và cập nhật số lượng sản phẩm đã bán
      for (const item of cart.items) {
        await updateSoldCount(item.product_id, item.quantity);
      }
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy danh sách giỏ hàng với trạng thái cụ thể
const getCartsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const carts = await Cart.find({ status });
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const updateCartItem = async (req, res) => {
  try {
    const cartId = req.params.cartId; // ID của giỏ hàng
    const productId = req.params.productId; // ID của sản phẩm cần cập nhật
    const quantity = req.body.quantity; // Số lượng mới

    // Kiểm tra xem giỏ hàng có tồn tại không
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // Kiểm tra xem sản phẩm có đủ số lượng trong kho không
    if (quantity > product.countInStock) {
      return res
        .status(400)
        .json({ message: "Không đủ số lượng sản phẩm trong kho." });
    }

    // Tìm mục (item) cần cập nhật trong giỏ hàng
    const cartItem = cart.items.find(
      (item) => item.product_id.toString() === productId
    );

    // Nếu mục (item) không tồn tại, thêm mục mới vào giỏ hàng
    if (!cartItem) {
      cart.items.push({ product_id: productId, quantity });
    } else {
      // Nếu mục (item) đã tồn tại, cập nhật số lượng
      cartItem.quantity = quantity;
    }

    // Lưu lại giỏ hàng sau khi cập nhật
    await cart.save();

    return res.status(200).json({ message: "Cập nhật thành công." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
module.exports = {
  createCart,
  getCartByUser,
  addItemToCart,
  removeItemFromCart,
  updateCartStatus,
  updateCartItem,
  getCartsByStatus,
};
