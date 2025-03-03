const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

const otpStore = {}; // In-memory storage for OTPs

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, // Use environment variables
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTP = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const otp = generateOTP();
  const expiryTime = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  otpStore[email] = { otp, expiresAt: expiryTime };
  console.log("OTP Generated:", otpStore); // Debugging

  // Auto-delete OTP after expiry
  setTimeout(() => {
    delete otpStore[email];
    console.log(`OTP expired for ${email}`);
  }, 5 * 60 * 1000);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    delete otpStore[email]; // Remove OTP if sending failed
    return false;
  }
};

const validateOTP = (req, res) => {
  console.log("Received OTP verification request:", req.body); // Debugging

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const storedOTP = otpStore[email];

  if (!storedOTP) {
    return res.status(400).json({ success: false, message: "OTP expired or invalid" });
  }

  if (Date.now() > storedOTP.expiresAt) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOTP.otp === otp.toString()) {
    delete otpStore[email]; // OTP is valid, remove it
    return res.status(200).json({ success: true, message: "OTP validated successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};

module.exports = {
  sendOTP,
  validateOTP,
};
