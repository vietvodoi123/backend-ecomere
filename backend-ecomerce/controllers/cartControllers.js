const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Controller để lấy tất cả cart của một người dùng dựa trên user_id
const getAllCartsForUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Tìm tất cả các cart của user dựa trên user_id
    const carts = await Cart.find({ user_id });

    if (!carts) {
      res.status(404).json({ message: "Không tìm thấy!" });
    }
    console.log(carts);
    res.status(200).json({ data: carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Controller để thêm sản phẩm vào cart hoặc cập nhật số lượng nếu sản phẩm đã tồn tại trong cart
const addToCart = async (req, res) => {
  try {
    const { user_id, items, isPaid, status } = req.body;

    // Tìm cart của user (nếu đã tồn tại)
    const cart = new Cart({
      user_id,
      items: items,
      isPaid,
      status,
    });

    // Lưu cart (hoặc cart mới) vào cơ sở dữ liệu
    await cart.save();

    res.status(200).json({ message: "Đặt hàng thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật trạng thái và số lượng đã bán của sản phẩm khi cart đã thanh toán hoặc giao hàng thành công
const updateCartStatus = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { status } = req.body;

    // Tìm cart của user
    const cart = await Cart.findOne({ cart_id });

    if (!cart) {
      return res.status(404).json({ error: "Không tìm thấy cart." });
    }

    if (status === "Paid" || status === "Delivered") {
      // Cập nhật trạng thái cart
      cart.status = status;

      // Cập nhật số lượng đã bán của các sản phẩm trong cart
      for (const item of cart.items) {
        const product = await Product.findById(item.product_id);
        if (product) {
          product.unitsSold += item.quantity;
          await product.save();
        }
      }
      // Đặt cart đã thanh toán hoặc đã giao hàng thành công
      cart.isPaid = true;
    }
    // Lưu cart cập nhật vào cơ sở dữ liệu
    await cart.save();

    res.status(200).json({ message: "Cập nhật cart thành công." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToCart, updateCartStatus, getAllCartsForUser };
