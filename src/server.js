import app from "./app.js";
import connectDB from "./config/db_config.js";
import envConfig from "./config/env_config.js";

/*
  Connect to database and start server
*/
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start Express server
    app.listen(envConfig.port, () => {
      console.log(
        `Server running on port ${envConfig.port} in ${process.env.NODE_ENV || "development"} mode`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
