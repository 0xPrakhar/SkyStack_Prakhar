const mongoose = require("mongoose");
const Event = require("./Models/Event");
const User = require("./Models/User");

const seedData = async () => {
  try {
    // Create a demo organizer
    const organizer = await User.findOne({ email: "organizer@example.com" });
    if (!organizer) {
      const hash = await require("bcryptjs").hash("password123", 10);
      await User.create({
        name: "Demo Organizer",
        email: "organizer@example.com",
        password: hash,
        role: "organizer"
      });
    }

    // Create demo events
    const events = [
      {
        title: "Tech Conference 2024",
        description: "A conference about latest tech trends",
        date: "2024-12-15",
        location: "San Francisco, CA",
        createdBy: (await User.findOne({ email: "organizer@example.com" }))._id
      },
      {
        title: "Music Festival",
        description: "Summer music festival with top artists",
        date: "2024-07-20",
        location: "Austin, TX",
        createdBy: (await User.findOne({ email: "organizer@example.com" }))._id
      },
      {
        title: "Startup Pitch Night",
        description: "Pitch your startup ideas to investors",
        date: "2024-11-10",
        location: "New York, NY",
        createdBy: (await User.findOne({ email: "organizer@example.com" }))._id
      }
    ];

    for (const event of events) {
      const exists = await Event.findOne({ title: event.title });
      if (!exists) {
        await Event.create(event);
      }
    }

    console.log("Demo data seeded");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

module.exports = seedData;