import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt_config.js";

/*
  @desc    Protect routes using JWT
*/
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Attach user info to request
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized access"
    });
  }
};

export default authMiddleware;
