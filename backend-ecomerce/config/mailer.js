// mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or another service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

module.exports = transporter;
