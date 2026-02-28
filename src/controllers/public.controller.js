import User from "../models/user.model.js";

/*
  @desc    Get public portfolio by slug
  @route   GET /api/public/:slug
  @access  Public
*/
export const getPublicPortfolio = async (req, res) => {
  try {
    const { username: slug } = req.params; // ✅ param name kept same, treated as slug

    const user = await User.findOne({ slug }).select( // ✅ query by slug instead of username
      "-password -phone_number -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    // Portfolio not yet created
    if (!user.portfolio_type) {
      return res.status(400).json({
        success: false,
        message: "Portfolio not published yet"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        profile_image_url: user.profile_image_url,
        social_links: user.social_links,
        certifications: user.certifications,
        portfolio_type: user.portfolio_type,
        fresher: user.portfolio_type === "fresher" ? user.fresher : null,
        experienced:
          user.portfolio_type === "experienced" ? user.experienced : null
      }
    });
  } catch (error) {
    console.error("Public Portfolio Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};