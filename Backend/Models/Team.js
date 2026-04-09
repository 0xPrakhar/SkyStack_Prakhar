const mongoose = require("mongoose");
const crypto = require("crypto");

const teamSchema = new mongoose.Schema({
  // Team info
  teamName: {
    type: String,
    required: true
  },
  
  teamCode: {
    type: String,
    unique: true,
    required: true,
    default: () => crypto.randomBytes(6).toString("hex").toUpperCase()
  },
  
  description: String,
  
  // Leader info
  leaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  leaderName: String,
  leaderEmail: String,
  
  // Members
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String,
    email: String,
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "accepted"
    }
  }],
  
  // Event registration
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }],
  
  // Max members
  maxMembers: {
    type: Number,
    default: 10
  },
  
  // Privacy
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Team", teamSchema);
