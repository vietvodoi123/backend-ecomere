const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { connectDB } = require("./config/db");
const app = express();

// Middleware để phân tích dữ liệu JSON
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
// Khởi động máy chủ
app.listen(3000, () => {
  console.log(`Máy chủ đang chạy trên cổng ${3000}`);
});
