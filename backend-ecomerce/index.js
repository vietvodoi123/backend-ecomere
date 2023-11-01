const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cors = require("cors");
const { connectDB } = require("./config/db");
const app = express();

const corsOptions = {
  origin: "https://backend-ecomerce-ropi.onrender.com", // Đổi thành địa chỉ URL của ứng dụng triển khai của bạn
};
app.use(cors(corsOptions));
// Middleware để phân tích dữ liệu JSON
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/reviews", reviewRoutes);
// Khởi động máy chủ
app.listen(3000, () => {
  console.log(`Máy chủ đang chạy trên cổng ${3000}`);
});
