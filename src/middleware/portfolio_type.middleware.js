import User from "../models/user.model.js";

/*
  Middleware to allow only fresher portfolio users
*/
export const fresherOnly = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("portfolio_type");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.portfolio_type !== "fresher") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Fresher portfolio required"
      });
    }

    next();
  } catch (error) {
    console.error("Fresher Middleware Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/*
  Middleware to allow only experienced portfolio users
*/
export const experiencedOnly = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("portfolio_type");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.portfolio_type !== "experienced") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Experienced portfolio required"
      });
    }

    next();
  } catch (error) {
    console.error("Experienced Middleware Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
