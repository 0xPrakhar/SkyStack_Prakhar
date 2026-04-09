const express = require("express");
const router = express.Router();
const Ticket = require("../Models/Ticket");
const Event = require("../Models/Event");
const User = require("../Models/User");
const authMiddleware = require("../Middleware/AuthMiddleware");

// 🎟️ GET user's tickets
router.get("/my-tickets", authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id })
      .populate("eventId")
      .sort({ bookingDate: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ msg: "Error fetching tickets" });
  }
});

// 🎟️ GET single ticket by ID
router.get("/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("eventId")
      .populate("userId");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ msg: "Error fetching ticket" });
  }
});

// 🎟️ GET ticket by ticket ID (unique string)
router.get("/details/:ticketId", async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate("eventId")
      .populate("userId");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ msg: "Error fetching ticket" });
  }
});

// 🎟️ GET organizer's event tickets (for check-in)
router.get("/organizer/:eventId", authMiddleware, async (req, res) => {
  try {
    // Verify organizer owns this event
    const event = await Event.findById(req.params.eventId);

    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const tickets = await Ticket.find({ eventId: req.params.eventId })
      .populate("userId")
      .sort({ bookingDate: -1 });

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ msg: "Error fetching tickets" });
  }
});

// 📊 GET ticket statistics
router.get("/stats/:eventId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const stats = {
      totalTickets: await Ticket.countDocuments({ eventId: req.params.eventId }),
      activeTickets: await Ticket.countDocuments({
        eventId: req.params.eventId,
        status: "active"
      }),
      usedTickets: await Ticket.countDocuments({
        eventId: req.params.eventId,
        status: "used"
      }),
      checkedIn: await Ticket.countDocuments({
        eventId: req.params.eventId,
        checkedIn: true
      }),
      revenue: 0
    };

    // Calculate revenue
    const tickets = await Ticket.find({ eventId: req.params.eventId });
    stats.revenue = tickets.reduce((sum, ticket) => sum + (ticket.price || 0), 0);

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ msg: "Error fetching statistics" });
  }
});

module.exports = router;
