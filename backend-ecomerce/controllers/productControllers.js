const Product = require("../models/Product");
const User = require("../models/User");

// Controller để thêm sản phẩm mới
const addProduct = async (req, res) => {
  try {
    const {
      name,
      long_desc,
      short_desc,
      category,
      price,
      discount,
      countInStock,
      imageUrl,
      creatorId,
    } = req.body;
    const product = new Product({
      name,
      long_desc,
      short_desc,
      category,
      price,
      discount,
      countInStock,
      imageUrl,
      creatorId,
    });

    await product.save();

    res.status(201).json({ message: "Sản phẩm đã được thêm." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    let { page, pageSize, name, category, sortBy, sortOrder, creatorId } =
      req.query;

    // Xác định giá trị mặc định nếu các tham số không tồn tại
    if (!page) page = 1;
    if (!pageSize) pageSize = 10;
    if (!sortBy) sortBy = "name";
    if (!sortOrder) sortOrder = "asc";

    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }
    if (creatorId) {
      filter.creatorId = creatorId;
    }

    // Xử lý sắp xếp với nhiều thuộc tính
    let sortOptions = {};
    const sortByFields = sortBy.split(","); // Tách các thuộc tính sắp xếp bằng dấu phẩy
    const sortOrderFields = sortOrder.split(",");
    // Ánh xạ thứ tự sắp xếp tương ứng với các thuộc tính
    sortByFields.forEach((field, index) => {
      sortOptions[field] = sortOrderFields[index] === "asc" ? 1 : -1;
    });

    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const products = await Product.find(filter)
      .sort(sortOptions)
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
      // Lấy thông tin người tạo sản phẩm
      const creatorInfo = await getUserInfo(product.creatorId);

      // Kết hợp thông tin người tạo vào thông tin sản phẩm
      const productWithCreator = {
        ...product.toObject(),
        creatorInfo,
      };

      res.json(productWithCreator);
    } else {
      res.status(404).json({ error: "Sản phẩm không được tìm thấy" });
    }
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy sản phẩm" });
  }
};

// Hàm lấy thông tin người tạo
const getUserInfo = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (user) {
      // Trả về thông tin cần thiết (avatar, fullname, email)
      return {
        id: userId,
        avatar: user.avatar,
        fullName: user.fullName,
        email: user.email,
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// Controller để sửa sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      long_desc,
      short_desc,
      category,
      price,
      discount,
      countInStock,
      imageUrl,
    } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không được tìm thấy" });
    }

    if (product.creatorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền cập nhật sản phẩm này." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        long_desc,
        short_desc,
        category,
        price,
        discount,
        countInStock,
        imageUrl,
      },
      { new: true }
    );

    if (updatedProduct) {
      res.json({
        message: "Cập nhật sản phẩm thành công!",
        item: updatedProduct,
      });
    } else {
      res.status(404).json({ error: "Sản phẩm không được tìm thấy" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không được tìm thấy" });
    }

    // Kiểm tra xem người gửi yêu cầu có quyền xóa sản phẩm không
    if (product.creatorId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền xóa sản phẩm này" });
    }

    // Xóa sản phẩm
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (deletedProduct) {
      res.json({ message: "Sản phẩm đã được xóa" });
    } else {
      res.status(404).json({ error: "Sản phẩm không được tìm thấy" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
