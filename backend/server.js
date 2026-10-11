
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const User = require("./models/User");
const Complaint = require("./models/Complaint");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5001;
const ML_API = process.env.ML_API || "http://127.0.0.1:5000";

// --------------------------------------------------
// ENVIRONMENT VALIDATION
// --------------------------------------------------

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET in backend .env");
  process.exit(1);
}

// --------------------------------------------------
// DATABASE CONNECTION
// --------------------------------------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });

// --------------------------------------------------
// AUTHENTICATION MIDDLEWARE
// --------------------------------------------------

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwt = require("jsonwebtoken");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}

function verifyAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Administrator access is required.",
    });
  }

  next();
}

// --------------------------------------------------
// AUTHENTICATION ROUTES
// --------------------------------------------------

app.use("/api/auth", require("./routes/authRoutes"));

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Customer Complaint Intelligence API is running.",
    status: "OK",
  });
});

// --------------------------------------------------
// ML PREDICTION ONLY
// Does not save the complaint to MongoDB.
// --------------------------------------------------

app.post("/api/complaints/predict", verifyToken, async (req, res) => {
  try {
    const { complaint } = req.body;

    if (
      typeof complaint !== "string" ||
      complaint.trim().length < 5
    ) {
      return res.status(400).json({
        message: "Please enter a complaint with at least 5 characters.",
      });
    }

    const predictionResponse = await axios.post(
      `${ML_API}/predict`,
      { complaint: complaint.trim() },
      { timeout: 30000 }
    );

    const prediction = predictionResponse.data;

    if (!prediction || !prediction.predictedProduct) {
      return res.status(502).json({
        message: "The ML service returned an invalid prediction.",
      });
    }

    return res.json({
      message: "Prediction completed successfully.",
      predictedProduct: prediction.predictedProduct,
      confidence:
        typeof prediction.confidence === "number" &&
        Number.isFinite(prediction.confidence)
          ? prediction.confidence
          : null,
    });
  } catch (error) {
    console.error(
      "Prediction error:",
      error.response?.data || error.message
    );

    return res.status(503).json({
      message:
        "Unable to predict the complaint category. Check whether the ML service is running.",
    });
  }
});

// --------------------------------------------------
// SUBMIT AND SAVE COMPLAINT
// Saves the complaint for the currently logged-in user.
// --------------------------------------------------

app.post("/api/complaints", verifyToken, async (req, res) => {
  try {
    const { complaint } = req.body;

    if (
      typeof complaint !== "string" ||
      complaint.trim().length < 5
    ) {
      return res.status(400).json({
        message: "Please enter a complaint with at least 5 characters.",
      });
    }

    if (!mongoose.isValidObjectId(req.user.userId)) {
      return res.status(401).json({
        message: "Invalid user account in authentication token.",
      });
    }

    // Confirm that the user still exists.
    const userExists = await User.exists({
      _id: req.user.userId,
    });

    if (!userExists) {
      return res.status(401).json({
        message: "User account not found. Please log in again.",
      });
    }

    // Obtain prediction from the Python ML service.
    const predictionResponse = await axios.post(
      `${ML_API}/predict`,
      { complaint: complaint.trim() },
      { timeout: 30000 }
    );

    const prediction = predictionResponse.data;

    if (
      !prediction ||
      typeof prediction.predictedProduct !== "string" ||
      !prediction.predictedProduct.trim()
    ) {
      return res.status(502).json({
        message: "The ML service returned an invalid prediction.",
      });
    }

    const confidence =
      typeof prediction.confidence === "number" &&
      Number.isFinite(prediction.confidence)
        ? prediction.confidence
        : null;

    const savedComplaint = await Complaint.create({
      userId: req.user.userId,
      complaint: complaint.trim(),
      predictedProduct: prediction.predictedProduct.trim(),
      confidence,
      status: "Pending",
      adminRemarks: "",
      statusHistory: [
        {
          status: "Pending",
          remarks: "Complaint submitted successfully.",
          updatedBy: req.user.userId,
          updatedAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      message: "Complaint submitted successfully.",
      complaint: savedComplaint,
    });
  } catch (error) {
    console.error(
      "Submit complaint error:",
      error.response?.data || error.message
    );

    if (error.response) {
      return res.status(503).json({
        message:
          "The ML service could not process your complaint. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Unable to submit complaint.",
    });
  }
});

// --------------------------------------------------
// MY COMPLAINTS
// Returns only the logged-in user's complaints.
// --------------------------------------------------

app.get("/api/complaints/my", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const statistics = {
      total: complaints.length,
      pending: complaints.filter(
        (item) => item.status === "Pending"
      ).length,
      inProgress: complaints.filter(
        (item) => item.status === "In Progress"
      ).length,
      resolved: complaints.filter(
        (item) => item.status === "Resolved"
      ).length,
    };

    return res.json({
      statistics,
      complaints,
    });
  } catch (error) {
    console.error("Fetch my complaints error:", error.message);

    return res.status(500).json({
      message: "Unable to load your complaints.",
    });
  }
});

// --------------------------------------------------
// ADMIN: VIEW ALL COMPLAINTS
// Admin only.
// --------------------------------------------------

app.get(
  "/api/complaints",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .lean();

      return res.json(complaints);
    } catch (error) {
      console.error("Fetch all complaints error:", error.message);

      return res.status(500).json({
        message: "Unable to load complaint records.",
      });
    }
  }
);

// --------------------------------------------------
// ADMIN: UPDATE COMPLAINT STATUS AND REMARKS
// Adds every update to statusHistory.
// --------------------------------------------------

app.patch(
  "/api/complaints/:id/status",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, remarks = "" } = req.body;

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
      ];

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          message: "Invalid complaint ID.",
        });
      }

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid complaint status.",
        });
      }

      if (
        typeof remarks !== "string" ||
        remarks.length > 2000
      ) {
        return res.status(400).json({
          message: "Remarks must be text under 2000 characters.",
        });
      }

      const existingComplaint = await Complaint.findById(id);

      if (!existingComplaint) {
        return res.status(404).json({
          message: "Complaint not found.",
        });
      }

      const cleanRemarks = remarks.trim();

      existingComplaint.status = status;
      existingComplaint.adminRemarks = cleanRemarks;

      existingComplaint.statusHistory.push({
        status,
        remarks: cleanRemarks,
        updatedBy: req.user.userId,
        updatedAt: new Date(),
      });

      // Keep the resolution timestamp when resolved.
      // Clear it if the complaint is reopened.
      existingComplaint.resolvedAt =
        status === "Resolved" ? new Date() : null;

      await existingComplaint.save();

      const updatedComplaint = await Complaint.findById(id)
        .populate("userId", "name email")
        .populate("statusHistory.updatedBy", "name email")
        .lean();

      return res.json({
        message: "Complaint updated successfully.",
        complaint: updatedComplaint,
      });
    } catch (error) {
      console.error("Update complaint error:", error.message);

      return res.status(500).json({
        message: "Unable to update complaint.",
      });
    }
  }
);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
