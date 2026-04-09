const mongoose = require("mongoose");
const crypto = require("crypto");

const ticketSchema = new mongoose.Schema({
  // Ticket identification
  ticketId: {
    type: String,
    unique: true,
    required: true,
    default: () => `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
  
  // References
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  
  // Ticket details
  userName: String,
  userEmail: String,
  eventTitle: String,
  eventDate: String,
  eventLocation: String,
  
  // QR Code (base64 encoded or URL)
  qrCode: String,
  
  // Ticket status
  status: {
    type: String,
    enum: ["active", "used", "cancelled"],
    default: "active"
  },
  
  // Check-in info
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkInTime: Date,
  
  // Pricing
  price: Number,
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "refunded"],
    default: "completed"
  },
  
  // Timestamps
  bookingDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
