import express from "express";
import { getPublicPortfolio } from "../controllers/public.controller.js";

const router = express.Router();

/*
  @route   GET /api/public/:username
  @desc    Get public portfolio by username
  @access  Public
*/
router.get("/:username", getPublicPortfolio);

export default router;
