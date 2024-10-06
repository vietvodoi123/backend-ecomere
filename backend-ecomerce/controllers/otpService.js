// otp.js
const crypto = require("crypto");

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
}

module.exports = generateOTP;

// otpService.js
const transporter = require("../config/mailer");

async function sendOTP(email) {
  const otp = generateOTP();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return otp; // Return the OTP for verification
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send OTP");
  }
}

module.exports = sendOTP;
