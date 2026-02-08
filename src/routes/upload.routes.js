import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadImageToCloudinary } from "../utils/image_upload.util.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/*
  @desc    Upload profile image
  @route   POST /api/upload/profile-image
  @access  Private
*/
router.post(
  "/profile-image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required"
        });
      }

      const image_url = await uploadImageToCloudinary(
        req.file.buffer,
        "profile_images"
      );

      res.status(200).json({
        success: true,
        image_url
      });
    } catch (error) {
      console.error("Profile Image Upload Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Image upload failed"
      });
    }
  }
);

/*
  @desc    Upload project image
  @route   POST /api/upload/project-image
  @access  Private
*/
router.post(
  "/project-image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required"
        });
      }

      const image_url = await uploadImageToCloudinary(
        req.file.buffer,
        "project_images"
      );

      res.status(200).json({
        success: true,
        image_url
      });
    } catch (error) {
      console.error("Project Image Upload Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Image upload failed"
      });
    }
  }
);

export default router;
