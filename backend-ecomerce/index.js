const express = require("express");
const app = express();

// Middleware để phân tích dữ liệu JSON
app.use(express.json());

// Định nghĩa các tuyến đường của bạn và kết nối với MongoDB bằng Mongoose
// Ví dụ một tuyến đường:
app.get("/api/items", (req, res) => {
  // Thực hiện logic của bạn ở đây
});

// Khởi động máy chủ
app.listen(3000, () => {
  console.log(`Máy chủ đang chạy trên cổng ${3000}`);
});
const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://vietvodoi1232:viet24112001@cluster0.l23cbqm.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Đã kết nối với MongoDB");
  })
  .catch((err) => {
    console.error("Lỗi kết nối với MongoDB: ", err);
  });
