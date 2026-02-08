import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token_util.js";

/*
  @desc    Register new user
  @route   POST /api/auth/register
  @access  Public
*/
export const registerUser = async (req, res) => {
  try {
    const { username, phone_number, password } = req.body;

    // Basic validation
    if (!username || !phone_number || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { phone_number }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or phone number already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      phone_number,
      password: hashedPassword
    });

    // Generate JWT
    const token = generateToken({
      userId: user._id
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/*
  @desc    Login user
  @route   POST /api/auth/login
  @access  Public
*/
export const loginUser = async (req, res) => {
  try {
    const { username, phone_number, password } = req.body;

    if ((!username && !phone_number) || !password) {
      return res.status(400).json({
        success: false,
        message: "Username or phone number and password are required"
      });
    }

    // Find user by username OR phone number
    const user = await User.findOne({
      $or: [{ username }, { phone_number }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT
    const token = generateToken({
      userId: user._id
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
