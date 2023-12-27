const bcrypt = require("bcryptjs");
const User = require("../models/User");
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
    console.log("Error: ", err);
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

module.exports = {
  signUpUser,
  signInUser,
  getUser,
  changePassword,
  getUserById,
};
