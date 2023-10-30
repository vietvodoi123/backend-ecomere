const express = require("express");
const userRoutes = require("./routes/userRoutes");
const { connectDB } = require("./config/db");
const app = express();

// Middleware để phân tích dữ liệu JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

connectDB();

app.use("/api/user", userRoutes);
// Khởi động máy chủ
app.listen(3000, () => {
  console.log(`Máy chủ đang chạy trên cổng ${3000}`);
});
