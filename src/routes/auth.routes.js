import express from "express";
import {
  registerUser,
  loginUser
} from "../controllers/auth.controller.js";
import {
  validateRequiredFields
} from "../middleware/validation.middleware.js";

const router = express.Router();

/*
  @route   POST /api/auth/register
  @desc    Register new user
  @access  Public
*/
router.post(
  "/register",
  validateRequiredFields(["username", "phone_number", "password"]),
  registerUser
);

/*
  @route   POST /api/auth/login
  @desc    Login user
  @access  Public
*/
router.post(
  "/login",
  validateRequiredFields(["password"]),
  loginUser
);

export default router;
