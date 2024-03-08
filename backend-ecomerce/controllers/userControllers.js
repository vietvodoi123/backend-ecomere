const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const { sendResponseError } = require("../middleware/middleware");
const { checkPassword, newToken } = require("../utils/function");

const signUpUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Nếu email đã tồn tại, trả về lỗi và dừng hàm
      sendResponseError(400, "Email already exists", res);
      return;
    }

    // Nếu email không tồn tại, tiếp tục quá trình đăng ký
    const hash = await bcrypt.hash(password, 8);

    await User.create({ ...req.body, password: hash });
    res.status(201).send("Successfully account opened");
  } catch (err) {
    sendResponseError(500, "Something wrong, please try again", res);
  }
};

const signInUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!!!user) {
      sendResponseError(400, "You have to Sign up first !", res);
    }

    const same = await checkPassword(password, user.password);
    if (same) {
      let token = newToken(user);
      res.status(200).send({
        status: "ok",
        token,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      });
      return;
    }
    sendResponseError(400, "InValid password !", res);
  } catch (err) {
    console.log("EROR", err);
    sendResponseError(500, `Error ${err}`, res);
  }
};

//khong co dung den
const getUser = async (req, res) => {
  res.status(200).send({ user: req.user });
};

// Controller để thay đổi mật khẩu của người dùng
const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (user) {
      // Trả về thông tin người dùng
      const userInfo = {
        id: userId,
        avatar: user.avatar,
        fullname: user.fullname,
        email: user.email,
        // Thêm các thông tin khác nếu cần
      };

      res.status(200).json(userInfo);
    } else {
      res.status(404).json({ error: "Người dùng không được tìm thấy" });
    }
  } catch (error) {
    res.status(500).json({ error: "Không thể lấy thông tin người dùng" });
  }
};

// Controller để cập nhật thông tin tài khoản
const updateUser = async (req, res) => {
  const { userId, avatar, fullName } = req.body; // Lấy dữ liệu từ request body

  try {
    const user = await User.findById(req.params.id); // Tìm người dùng dựa trên ID được cung cấp trong request parameters

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật các trường thông tin nếu chúng được cung cấp trong request body
    if (avatar) {
      user.avatar = avatar;
    }
    if (fullName) {
      user.fullName = fullName;
    }

    // Lưu người dùng đã cập nhật
    await user.save();

    return res.status(200).json({
      message: "Thông tin người dùng đã được cập nhật thành công",
      user: {
        status: "ok",
        token: newToken(user),
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    return res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại sau" });
  }
};

const getShopInfo = async (req, res) => {
  try {
    // Lấy thông tin người dùng (shop) từ database
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Lấy số lượng sản phẩm của shop
    const productCount = await Product.countDocuments({ creatorId: user._id });

    // Lấy tổng số sản phẩm đã bán của shop
    const totalUnitsSold = await Product.aggregate([
      { $match: { creatorId: user._id } },
      { $group: { _id: null, total: { $sum: "$unitsSold" } } },
    ]);

    // Lấy mảng các category sản phẩm của shop
    const productCategories = await Product.distinct("category", {
      creatorId: user._id,
    });

    // Trả về thông tin của shop
    res.status(200).json({
      id: user._id,
      name: user.fullName,
      avatar: user.avatar,
      productCount: productCount,
      totalUnitsSold: totalUnitsSold.length > 0 ? totalUnitsSold[0].total : 0,
      productCategories: productCategories,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin shop:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin shop" });
  }
};
module.exports = {
  signUpUser,
  signInUser,
  getUser,
  changePassword,
  getUserById,
  updateUser,
  getShopInfo,
};
