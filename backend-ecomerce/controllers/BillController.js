const { ObjectId } = require("mongodb");
const Bill = require("../models/Bill");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createBill = async (req, res) => {
  try {
    // Lấy dữ liệu từ request body
    const {
      products,
      buyer,
      address,
      phone,
      seller,
      totalPrice,
      paymentMethod,
      voucher,
      shippingMethod,
      comment,
      status,
    } = req.body;

    if (!address || !phone) {
      return res.status(400).json({ message: "phone and address are require" });
    }
    // Kiểm tra các điều kiện cần thiết và chuyển đổi buyer và seller thành ObjectId
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message:
          "Product IDs must be provided and must be an array with at least one item",
      });
    }

    // Kiểm tra tính hợp lệ của các ID (buyer, seller) và chuyển đổi thành ObjectId
    if (!ObjectId.isValid(buyer) || !ObjectId.isValid(seller)) {
      return res.status(400).json({ message: "Invalid buyer ID or seller ID" });
    }

    const buyerId = new ObjectId(buyer);
    const sellerId = new ObjectId(seller);

    if (typeof totalPrice !== "number" || totalPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Total price must be a positive number" });
    }

    if (
      !paymentMethod ||
      typeof paymentMethod !== "string" ||
      paymentMethod.trim() === ""
    ) {
      return res.status(400).json({
        message:
          "Payment method must be provided and must be a non-empty string",
      });
    }

    // Tạo đơn hàng mới
    const bill = new Bill({
      products: products,
      buyer: buyerId,
      seller: sellerId,
      totalPrice,
      paymentMethod,
      phone,
      address,
      voucher,
      shippingMethod,
      comment,
      status,
    });

    // Cập nhật thuộc tính unitSold của sản phẩm
    await Promise.all(
      products.map(async (productObj) => {
        const product = await Product.findById(productObj.product);
        if (product) {
          product.unitsSold += productObj.quantity;
          product.countInStock -= productObj.quantity;
          await product.save();
        }
      })
    );

    // Lưu đơn hàng vào cơ sở dữ liệu
    await bill.save();
    // Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng của người dùng
    await Cart.updateMany(
      { user_id: buyerId },
      { $pull: { items: { product_id: { $in: products.product } } } }
    );

    res.status(201).json({ message: "Bill created successfully", data: bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller để cập nhật bill
const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, address, phone } = req.body;
    // Xây dựng object chứa các trường cần cập nhật
    const updateFields = {};
    if (status) updateFields.status = status;
    if (address) updateFields.address = address;
    if (phone) updateFields.phone = phone;

    const updatedBill = await Bill.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!updatedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res
      .status(200)
      .json({ message: "Bill updated successfully", data: updatedBill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBillsByUser = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const { page = 1, searchKey, status } = req.query;
    const pageSize = 10;

    let query = { buyer: buyerId };
    if (status) {
      query.status = status;
    }
    if (searchKey) {
      const searchRegex = new RegExp(searchKey, "i");
      query.$or = [
        { "products.product.name": { $regex: searchRegex } }, // Lấy thông tin từ sản phẩm
        { "seller.fullName": { $regex: searchRegex } }, // Lấy thông tin từ người bán
      ];
    }

    const totalCount = await Bill.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    const bills = await Bill.find(query)
      .populate({
        path: "products",
        populate: {
          path: "product",
          model: "product",
        },
      })
      .populate({
        path: "seller",
        select: "id fullName",
      })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .exec();

    res.status(200).json({
      data: bills,
      page: Number(page),
      pageSize: pageSize,
      totalPage: totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller để lấy tất cả bill của người bán với các tùy chọn
const getAllBillsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status, searchKey, page = 1 } = req.query;
    const pageSize = 10;

    let query = { seller: sellerId };
    if (status) {
      query.status = status;
    }
    if (searchKey) {
      const searchRegex = new RegExp(searchKey, "i");
      query.$or = [
        { "products.product.name": { $regex: searchRegex } }, // Lấy thông tin từ sản phẩm
        { "buyer.fullName": { $regex: searchRegex } }, // Lấy thông tin từ người bán
      ];
    }
    const totalCount = await Bill.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    const bills = await Bill.find(query)
      .populate({
        path: "products",
        populate: {
          path: "product",
          model: "product",
        },
      })
      .populate({
        path: "buyer",
        select: "id fullName",
      })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .exec();

    res.status(200).json({
      data: bills,
      page: Number(page),
      pageSize: pageSize,
      totalPage: totalPages,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBill,
  updateBill,
  getAllBillsByUser,
  getAllBillsBySeller,
};
