import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt_config.js";

/*
  Generate JWT token
*/
const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

/*
  Verify JWT token (optional utility)
*/
export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

export default generateToken;
