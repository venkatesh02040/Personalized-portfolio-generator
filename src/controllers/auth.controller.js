import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token_util.js";

/* =========================================================
   HELPER: Safe User Response (Never expose password)
========================================================= */
const sanitizeUser = (user) => {
  return {
    _id: user._id,
    username: user.username,
    gmail: user.gmail,
    phone_number: user.phone_number,
    portfolio_type: user.portfolio_type || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

/* =========================================================
   @desc    Register new user
   @route   POST /api/auth/register
   @access  Public
========================================================= */
export const registerUser = async (req, res) => {
  try {
    const { username, phone_number, gmail, password } = req.body;

    /* ---------- Validation ---------- */
    if (!username || !phone_number || !gmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    /* ---------- Check Existing User ---------- */
    const existingUser = await User.findOne({
      $or: [
        { username },
        { phone_number },
        { gmail }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username, phone number or gmail already exists"
      });
    }

    /* ---------- Hash Password ---------- */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* ---------- Create User ---------- */
    const user = await User.create({
      username,
      phone_number,
      gmail: gmail.toLowerCase(),
      password: hashedPassword
    });

    /* ---------- Generate Token ---------- */
    const token = generateToken({
      userId: user._id
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =========================================================
   @desc    Login user
   @route   POST /api/auth/login
   @access  Public
========================================================= */
export const loginUser = async (req, res) => {
  try {
    const { username, phone_number, gmail, password } = req.body;

    /* ---------- Validation ---------- */
    if ((!username && !phone_number && !gmail) || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, phone number or gmail and password are required"
      });
    }

    /* ---------- Find User ---------- */
    const user = await User.findOne({
      $or: [
        username ? { username } : null,
        phone_number ? { phone_number } : null,
        gmail ? { gmail: gmail.toLowerCase() } : null
      ].filter(Boolean)
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    /* ---------- Compare Password ---------- */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    /* ---------- Generate Token ---------- */
    const token = generateToken({
      userId: user._id
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
