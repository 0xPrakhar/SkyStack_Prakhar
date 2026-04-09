const express = require("express");
const router = express.Router();
const Booking = require("../Models/Booking.js");
const Ticket = require("../Models/Ticket.js");
const Event = require("../Models/Event.js");
const User = require("../Models/User.js");
const auth = require("../Middleware/AuthMiddleware.js");

// BOOK EVENT
router.post("/:eventId", auth, async (req, res) => {
  try {
    // Check if already booked
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      event: req.params.eventId
    });

    if (existingBooking) {
      return res.status(400).json({ msg: "Already booked for this event" });
    }

    // Get event and user details
    const event = await Event.findById(req.params.eventId);
    const user = await User.findById(req.user.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: req.params.eventId
    });

    // Create ticket
    const ticket = await Ticket.create({
      userId: req.user.id,
      eventId: req.params.eventId,
      userName: user.name,
      userEmail: user.email,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      price: event.price || 0
    });

    res.json({
      booking,
      ticket,
      msg: "Ticket booked successfully!"
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ msg: "Booking failed" });
  }
});

// GET MY BOOKINGS
router.get("/my", auth, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("event");

  res.json(bookings);
});

module.exports = router;