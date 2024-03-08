const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    address: { type: String, require: true },
    phone: { type: String, require: true },
    comment: { type: String },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    shippingMethod: {
      name: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    voucher: {
      code: {
        type: String,
      },
      discount: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], // Các giá trị trạng thái có thể
      default: "Pending", // Trạng thái mặc định là "Pending" (Chờ xử lý)
    },
    // Các thuộc tính khác có thể thêm vào tại đây
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
