import express from "express";
import cors from "cors";

/* ---------- ROUTES ---------- */
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import publicRoutes from "./routes/public.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

/* ---------- MIDDLEWARE ---------- */

// Enable CORS
app.use(cors());

// Parse incoming JSON
app.use(express.json());

/* ---------- ROUTE MOUNTING ---------- */

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/upload", uploadRoutes);

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running"
  });
});

export default app;
