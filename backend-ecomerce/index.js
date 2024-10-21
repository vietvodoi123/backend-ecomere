const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const billRoutes = require("./routes/billRoute");
const postRoutes = require("./routes/postRoute");

const User = require("./models/User");
const sendOTP = require("./controllers/otpService");

const { connectDB } = require("./config/db");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

connectDB();
app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/posts", postRoutes);

const otpStore = {};
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    const otp = await sendOTP(email);
    otpStore[email] = { otp, expires: Date.now() + 300000 };

    return res.status(200).send("OTP sent to your email");
  } catch (error) {
    return res.status(500).send("Could not send OTP");
  }
});
app.post("/api/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email].otp === otp) {
    if (Date.now() < otpStore[email].expires) {
      delete otpStore[email];
      await User.findOneAndUpdate({ email: email }, { isVerify: true });

      return res.status(200).send("OTP verified successfully");
    } else {
      return res.status(400).send("OTP has expired");
    }
  } else {
    return res.status(400).send("Invalid OTP");
  }
});

app.listen(5000, () => {
  console.log(`Máy chủ đang chạy trên cổng ${5000}`);
});
