const User = require('../models/User');
const jwt = require('jsonwebtoken');
const otpService = require('../services/otpService'); // Import OTP service

// Register User with OTP verification
exports.registerUser = async (req, res) => {
  const { name, age, gender, email, phone, password, confirmPassword, otp } = req.body;

  if (!name || !email || !phone || !password || !confirmPassword || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Verify OTP
  const otpValidationResponse = await otpService.validateOTP({ body: { email, otp } }, res);
  if (!otpValidationResponse.success) {
    return res.status(400).json({ message: otpValidationResponse.message });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({ name, age, gender, email, phone, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Send OTP to email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const isSent = await otpService.sendOTP(email);

    if (isSent) {
      res.status(200).json({ message: `OTP sent to ${email}` });
    } else {
      res.status(500).json({ message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  return otpService.validateOTP(req, res);
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
