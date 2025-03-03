const express = require('express');
const { registerUser, sendOtp, loginUser, verifyOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp); // Added verify OTP route
router.post('/login', loginUser);

module.exports = router;
