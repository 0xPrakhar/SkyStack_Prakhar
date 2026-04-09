const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema({
  // References
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true
  },
  
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
  
  // Organizer who checked in
  organzierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  
  // Check-in details
  checkInTime: {
    type: Date,
    default: Date.now
  },
  
  method: {
    type: String,
    enum: ["qr", "manual", "checklist"],
    default: "qr"
  },
  
  // Optional notes
  notes: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CheckIn", checkInSchema);
