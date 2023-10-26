require("dotenv").config();
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { connectDB } = require("./config/db");

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/cart", cartRoutes);

app.listen(3000, () => console.log(`Server running on port ${PORT}`));
