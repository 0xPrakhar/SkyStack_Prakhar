const express = require("express");
const router = express.Router();
const CheckIn = require("../Models/CheckIn");
const Ticket = require("../Models/Ticket");
const Event = require("../Models/Event");
const authMiddleware = require("../Middleware/AuthMiddleware");

// ✅ Check-in user via QR code
router.post("/verify/:ticketId", authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
      .populate("eventId");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    // Verify organizer owns the event
    const event = await Event.findById(ticket.eventId);
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Check if already checked-in
    if (ticket.checkedIn) {
      return res.status(400).json({
        msg: "User already checked in",
        checkInTime: ticket.checkInTime
      });
    }

    // If ticket is not active
    if (ticket.status !== "active") {
      return res.status(400).json({ msg: "Ticket is not valid" });
    }

    // Create check-in record
    const checkIn = await CheckIn.create({
      ticketId: ticket._id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      organizerId: req.user.id,
      method: "qr"
    });

    // Update ticket
    ticket.checkedIn = true;
    ticket.checkInTime = new Date();
    ticket.status = "used";
    await ticket.save();

    // Add to event's checked-in users
    await Event.findByIdAndUpdate(
      ticket.eventId,
      { $addToSet: { checkedIn: ticket.userId } },
      { new: true }
    );

    res.json({
      msg: "Check-in successful",
      ticket: {
        ticketId: ticket.ticketId,
        userName: ticket.userName,
        eventTitle: ticket.eventTitle,
        checkInTime: ticket.checkInTime
      }
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ msg: "Check-in failed" });
  }
});

// ✅ Manual check-in (for backup)
router.post("/manual", authMiddleware, async (req, res) => {
  try {
    const { ticketId, notes } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    // Verify organizer owns the event
    const event = await Event.findById(ticket.eventId);
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (ticket.checkedIn) {
      return res.status(400).json({ msg: "User already checked in" });
    }

    // Create check-in record
    await CheckIn.create({
      ticketId: ticket._id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      organizerId: req.user.id,
      method: "manual",
      notes
    });

    // Update ticket
    ticket.checkedIn = true;
    ticket.checkInTime = new Date();
    ticket.status = "used";
    await ticket.save();

    res.json({ msg: "Check-in successful", ticket });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ msg: "Check-in failed" });
  }
});

// 📊 GET check-in statistics for event
router.get("/stats/:eventId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const checkIns = await CheckIn.find({ eventId: req.params.eventId });
    const tickets = await Ticket.find({ eventId: req.params.eventId });

    const stats = {
      totalTickets: tickets.length,
      checkedIn: checkIns.length,
      notCheckedIn: tickets.length - checkIns.length,
      attendanceRate: tickets.length > 0
        ? Math.round((checkIns.length / tickets.length) * 100)
        : 0,
      checkInsByTime: {}
    };

    // Group check-ins by hour
    checkIns.forEach(checkIn => {
      const hour = new Date(checkIn.checkInTime).getHours();
      stats.checkInsByTime[hour] = (stats.checkInsByTime[hour] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ msg: "Error fetching statistics" });
  }
});

// 📝 GET check-in records for event
router.get("/records/:eventId", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const checkIns = await CheckIn.find({ eventId: req.params.eventId })
      .populate("userId", "name email")
      .sort({ checkInTime: -1 });

    res.json(checkIns);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ msg: "Error fetching records" });
  }
});

module.exports = router;
