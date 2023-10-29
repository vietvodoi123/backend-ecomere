const Product = require("../model/Products");

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Lấy danh sách sản phẩm với phân trang, tìm kiếm và trả về số lượng trang và tổng số bản ghi
const getProducts = async (req, res) => {
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

module.exports = {
  getProducts,
  getProductById,
};
