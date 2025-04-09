const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const cloudinary = require("cloudinary").v2; // Assuming you are using Cloudinary
const auth = require("../middleware/auth"); // Authentication middleware
const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, nameWithInitials, email, password, phoneNumber, gender, experience, skills, portfolioURL, linkedinURL } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profilePicture = null;
    if (req.files?.profilePicture) {
      const file = req.files.profilePicture;
      profilePicture = {
        data: file.data,
        contentType: file.mimetype
      };
    }

    const user = new User({
      firstName,
      lastName,
      nameWithInitials,
      email,
      password: hashedPassword,
      phoneNumber,
      gender,
      experience,
      skills,
      portfolioURL,
      linkedinURL,
      profilePicture
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private (Requires auth middleware)
router.get("/profile", auth, async (req, res) => {
  try {
    // The 'auth' middleware already adds the 'user' object to the request, so we can directly access it
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return user data
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return a JWT token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and sign the JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id, user }); // Return token, user ID, and user object excluding password
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private (Requires auth middleware)
router.put("/profile", auth, async (req, res) => {
  try {
    const { firstName, lastName, nameWithInitials, phoneNumber, gender, experience, skills, portfolioURL, linkedinURL } = req.body;
    let { profilePicture } = req.files; // Assuming you're using a file upload library

    // Check if user exists
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload the profile picture to Cloudinary if provided
    let profilePictureUrl = user.profilePicture; // Keep current picture if no new one is provided
    if (profilePicture) {
      const uploadResult = await cloudinary.uploader.upload(profilePicture.tempFilePath);
      profilePictureUrl = uploadResult.secure_url;
    }

    // Update user data
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.nameWithInitials = nameWithInitials || user.nameWithInitials;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;
    user.experience = experience || user.experience;
    user.skills = skills || user.skills;
    user.portfolioURL = portfolioURL || user.portfolioURL;
    user.linkedinURL = linkedinURL || user.linkedinURL;
    user.profilePicture = profilePictureUrl;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error });
  }
});

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});


// Forgot Password Request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token to DB
    await PasswordResetToken.create({
      email: user.email,
      token: hashedToken,
      expiresAt: Date.now() + 3600000 // 1 hour
    });

    // Send email using Mailtrap configuration
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: '"Your App" <no-reply@example.com>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `Click <a href="${resetUrl}">here</a> to reset your password`
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Error sending reset email' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const resetToken = await PasswordResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() }
    });

    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ email: resetToken.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete reset token
    await PasswordResetToken.deleteOne({ token: hashedToken });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;
