const Product = require("../models/Product");

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, name, category } = req.query;

    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const products = await Product.find(filter)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    res.status(200).json({
      data: products,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages,
      totalRecords,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Sản phẩm không được tìm thấy" });
    }
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy sản phẩm" });
  }
};

module.exports = { getAllProducts, getProductById };
