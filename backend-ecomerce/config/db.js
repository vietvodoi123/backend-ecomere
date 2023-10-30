const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://vietvodoi1232:viet24112001@cluster0.l23cbqm.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connection SUCCESS");
  } catch (error) {
    console.error("MongoDB connection FAIL");
    process.exit(1);
  }
};

module.exports = { connectDB };
