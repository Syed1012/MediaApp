// ./server/rotues/auth.js (server-side)
import express from "express";
import User from "../models/User.js";
import JWT from "jsonwebtoken";
import { hashPassword, comparePassword } from "../helpers/authHelper.js"; // Assuming you have a function to compare passwords

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, question, answer, phone } = req.body;

    // Check for missing fields
    if (!username || !email || !password || !question || !answer || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      // Handle hashing error
      return res
        .status(500)
        .json({ success: false, message: "Error hashing password" });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      question,
      answer,
      phone,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    //token
    const token = JWT.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // If password is valid, login successful
    res
      .status(200)
      .json({ success: true, message: "Login successful", user: user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Forgot Password
router.post("/forgotpassword", async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // Check for missing fields
    if (!email || !question || !answer || !newPassword) {
      return res
        .status(400)
        .json({
          message: "Email, question, answer, and new password are required",
        });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if provided answer matches
    if (user.answer !== answer) {
      return res.status(400).json({ message: "Incorrect answer" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    if (!hashedPassword) {
      // Handle hashing error
      return res.status(500).json({ message: "Error hashing password" });
    }

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch user data route
router.get("/user", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;