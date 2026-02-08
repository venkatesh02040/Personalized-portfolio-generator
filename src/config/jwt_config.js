import envConfig from "./env_config.js";

/*
  Centralized JWT configuration
*/
const jwtConfig = {
  secret: envConfig.jwtSecret,
  expiresIn: envConfig.jwtExpiresIn
};

export default jwtConfig;
