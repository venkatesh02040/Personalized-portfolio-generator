import express from "express";
import {
  createOrUpdatePortfolio,
  getMyPortfolio
} from "../controllers/portfolio.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import {
  validatePortfolioPayload
} from "../middleware/validation.middleware.js";

const router = express.Router();

/*
  @route   POST /api/portfolio
  @desc    Create or update user portfolio
  @access  Private
*/
router.post(
  "/",
  authMiddleware,
  validatePortfolioPayload,
  createOrUpdatePortfolio
);

/*
  @route   GET /api/portfolio
  @desc    Get logged-in user's portfolio
  @access  Private
*/
router.get(
  "/",
  authMiddleware,
  getMyPortfolio
);

export default router;
