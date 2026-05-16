// Global error handler — catches anything passed to next(err)
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(". ") });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({ success: false, message: "Resource not found" });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: "Duplicate field value" });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
