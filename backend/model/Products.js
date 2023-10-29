const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  long_desc: {
    type: String,
    required: true,
  },
  short_desc: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: [String],
    required: true,
  },
  unitsSold: {
    type: Number,
    default: 0, // Số lượng đã bán mặc định là 0
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
