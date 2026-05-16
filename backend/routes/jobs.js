const express = require("express");
const router = express.Router();
const JobRequest = require("../models/JobRequest");
const { protect } = require("../middleware/auth");

// GET /api/jobs — list all jobs with optional filters
router.get("/", async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Keyword search across title and description
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
});

// GET /api/jobs/:id — fetch a single job
router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs — create a new job (auth required)
router.post("/", protect, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// PUT /api/jobs/:id — full update for edit page (auth required)
router.put("/:id", protect, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { title, description, category, location, contactName, contactEmail },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/jobs/:id — update status only
router.patch("/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Open", "In Progress", "Closed"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/jobs/:id — delete a job (auth required)
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;