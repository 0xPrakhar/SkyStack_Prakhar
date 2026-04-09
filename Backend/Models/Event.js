const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // Basic info
  title: {
    type: String,
    required: true
  },
  
  description: String,
  image: String,
  
  // Date and time
  date: {
    type: String,
    required: true
  },
  
  time: String,
  
  // Location info
  location: {
    type: String,
    required: true
  },
  
  // Coordinates for location-based discovery
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  
  city: String,
  state: String,
  
  // Event details
  category: {
    type: String,
    enum: ["tech", "music", "sports", "food", "business", "art", "education", "health", "other"],
    default: "other"
  },
  
  // Pricing
  price: {
    type: Number,
    default: 0
  },
  
  isFree: {
    type: Boolean,
    default: true
  },
  
  // Capacity
  capacity: {
    type: Number,
    default: 100
  },
  
  registrations: {
    type: Number,
    default: 0
  },
  
  // Organizer
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  organizerName: String,
  
  // Event status
  status: {
    type: String,
    enum: ["draft", "published", "ongoing", "completed", "cancelled"],
    default: "published"
  },
  
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Attendees
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  // Checked-in users
  checkedIn: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  
  // Tags for search
  tags: [String],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Event", eventSchema);
