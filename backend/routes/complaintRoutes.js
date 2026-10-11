
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

const router = express.Router();

// Verify login token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Login required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

// Submit a complaint after ML prediction
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { complaint, predictedProduct, confidence } = req.body;

    if (
      typeof complaint !== "string" ||
      !complaint.trim() ||
      typeof predictedProduct !== "string" ||
      !predictedProduct.trim()
    ) {
      return res.status(400).json({
        message: "Complaint text and predicted category are required"
      });
    }

    const newComplaint = await Complaint.create({
      userId: req.user.userId,
      complaint: complaint.trim(),
      predictedProduct: predictedProduct.trim(),
      confidence: Number.isFinite(confidence) ? confidence : null,
      status: "Pending"
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint
    });
  } catch (error) {
    console.error("Submit complaint error:", error);
    res.status(500).json({ message: "Failed to save complaint" });
  }
});

// Get only the logged-in user's complaints
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    const total = complaints.length;
    const pending = complaints.filter(
      c => c.status === "Pending"
    ).length;
    const inProgress = complaints.filter(
      c => c.status === "In Progress"
    ).length;
    const resolved = complaints.filter(
      c => c.status === "Resolved"
    ).length;

    res.json({
      complaints,
      statistics: { total, pending, inProgress, resolved }
    });
  } catch (error) {
    console.error("Fetch my complaints error:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// Admin: view all complaints
router.get("/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    console.error("Fetch all complaints error:", error);
    res.status(500).json({ message: "Failed to fetch all complaints" });
  }
});

// Admin: update complaint status
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid complaint ID" });
      }

      const allowedStatuses = ["Pending", "In Progress", "Resolved"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const complaint = await Complaint.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      res.json({
        message: "Complaint status updated",
        complaint
      });
    } catch (error) {
      console.error("Update complaint status error:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  }
);

module.exports = router;
