import dotenv from "dotenv";

/*
  Load environment variables from .env file
*/
dotenv.config();

const envConfig = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d"
};

/*
  Validate required environment variables
*/
if (!envConfig.mongoURI) {
  throw new Error("MONGO_URI is not defined in .env file");
}

if (!envConfig.jwtSecret) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

export default envConfig;
