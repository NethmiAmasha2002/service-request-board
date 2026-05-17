require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/service-board";

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB — only start listening if run directly (not imported by tests)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    if (require.main === module) {
      app.listen(PORT, () =>
        console.log(`🚀 Server running on http://localhost:${PORT}`)
      );
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;