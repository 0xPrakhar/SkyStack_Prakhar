const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user", "organizer"], default: "user" },
  
  // Profile
  phone: String,
  profilePicture: String,
  bio: String,
  
  // Interests/categories for recommendations
  interests: {
    type: [String],
    enum: ["tech", "music", "sports", "food", "business", "art", "education", "health"],
    default: []
  },
  
  // Location
  latitude: Number,
  longitude: Number,
  city: String,
  
  // Activity
  eventsAttended: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }],
  
  eventsRegistered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }],
  
  // Preferences
  emailNotifications: {
    type: Boolean,
    default: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);