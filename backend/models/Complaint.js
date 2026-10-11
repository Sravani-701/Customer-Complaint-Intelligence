
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaint: {
    type: String,
    required: true,
    trim: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  predictedProduct: {
    type: String,
    required: true
  },

  confidence: {
    type: Number,
    default: null
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },

  adminRemarks: {
    type: String,
    default: ""
  },

  statusHistory: [{
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      required: true
    },
    remarks: {
      type: String,
      default: ""
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  resolvedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
