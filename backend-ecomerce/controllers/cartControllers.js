const { ObjectId } = require("mongoose").Types;
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

///////////////
const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    // Kiểm tra xem user_id và product_id có tồn tại không
    if (!user_id || !product_id) {
      return res
        .status(400)
        .json({ message: "user_id và product_id là bắt buộc." });
    }

    // Tìm cart của user (nếu đã tồn tại)
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      // Nếu cart chưa tồn tại, tạo mới
      cart = new Cart({
        user_id,
        items: [{ product_id, quantity }], // Thêm item vào mảng items
      });
    } else {
      // Kiểm tra xem product_id đã tồn tại trong mảng items chưa
      const existingItem = cart.items.find(
        (item) => item.product_id.toString() === product_id.toString()
      );

      if (existingItem) {
        // Nếu item đã tồn tại, cập nhật số lượng
        existingItem.quantity += quantity;
      } else {
        // Nếu item chưa tồn tại, thêm vào mảng items
        cart.items.push({ product_id, quantity });
      }
    }

    // Lưu cart (hoặc cart mới) vào cơ sở dữ liệu
    await cart.save();

    res.status(200).json({ message: "Cập nhật giỏ hàng thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Tìm cart của user
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy cart." });
    }

    // Lấy tất cả các sản phẩm từ items
    const products = await Promise.all(
      cart.items.map(async (item) => {
        // Tìm thông tin của sản phẩm
        const product = await Product.findById(item.product_id);

        // Tìm thông tin của shop
        const shop = await User.findById(product.creatorId);
        // Bổ sung thông tin của shop vào sản phẩm
        const productWithShop = {
          ...product.toObject(),
          quantity: item.quantity,
          shop: {
            id: shop._id,
            name: shop.fullName,
          },
        };

        return productWithShop;
      })
    );

    // Sắp xếp các sản phẩm theo yêu cầu của bạn, ví dụ: sắp xếp theo tên
    const sortedProducts = products.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    res.status(200).json({ data: sortedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteItemInCart = async (req, res) => {
  try {
    const { user_id, item_id } = req.params;

    const itemId = new ObjectId(item_id);

    // Kiểm tra xem user_id và item_id có tồn tại không
    if (!user_id || !item_id) {
      return res
        .status(400)
        .json({ message: "user_id và item_id là bắt buộc." });
    }

    // Tìm cart của user
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy cart." });
    }

    // Xóa mục trong mảng items dựa trên item_id
    cart.items = cart.items.filter((item) => {
      return !item.product_id.equals(itemId); // Sử dụng equals() để so sánh ObjectId
    });

    // Lưu cart đã cập nhật vào cơ sở dữ liệu
    await cart.save();

    res.status(200).json({ message: "Xóa mục trong giỏ hàng thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateItemInCart = async (req, res) => {
  try {
    const { user_id, item_id } = req.params;

    const itemId = new ObjectId(item_id);
    let { quantity } = req.body; // Số lượng mới cần được cập nhật

    // Kiểm tra xem user_id và item_id có tồn tại không
    if (!user_id || !item_id) {
      return res
        .status(400)
        .json({ message: "user_id và item_id là bắt buộc." });
    }

    // Tìm cart của user
    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy cart." });
    }

    // Tìm item trong mảng items dựa trên item_id
    const foundIndex = cart.items.findIndex((item) =>
      item.product_id.equals(itemId)
    );

    // Nếu không tìm thấy item trong cart
    if (foundIndex === -1) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy item trong giỏ hàng." });
    }

    // Nếu quantity được cung cấp, kiểm tra và cập nhật
    if (quantity !== undefined) {
      quantity = parseInt(quantity); // Chuyển đổi thành số nguyên
      if (isNaN(quantity) || quantity < 0) {
        return res
          .status(400)
          .json({ message: "quantity phải là một số nguyên dương." });
      }
      // Cập nhật số lượng của item
      cart.items[foundIndex].quantity = quantity;
    }

    // Lưu cart đã cập nhật vào cơ sở dữ liệu
    await cart.save();

    res.status(200).json({ message: "Cập nhật giỏ hàng thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addToCart,
  getCartItems,
  deleteItemInCart,
  updateItemInCart,
};
