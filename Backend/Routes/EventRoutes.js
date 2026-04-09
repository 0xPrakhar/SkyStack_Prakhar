const express = require("express");
const router = express.Router();
const Event = require("../Models/Event.js");
const auth = require("../Middleware/AuthMiddleware.js");

// CREATE EVENT
router.post("/", auth, async (req, res) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.json(event);
});

// GET ALL EVENTS
router.get("/", async (req, res) => {
  const events = await Event.find().populate("createdBy", "name");
  res.json(events);
});

// GET SINGLE EVENT
router.get("/:id", async (req, res) => {
  const event = await Event.findById(req.params.id).populate("createdBy", "name");
  if (!event) return res.status(404).json({ msg: "Event not found" });
  res.json(event);
});

// DELETE EVENT
router.delete("/:id", auth, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;