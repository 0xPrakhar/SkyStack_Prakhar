const express = require("express");
const router = express.Router();
const Team = require("../Models/Team");
const User = require("../Models/User");
const authMiddleware = require("../Middleware/AuthMiddleware");

// 👥 CREATE team
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { teamName, description, maxMembers, isPublic } = req.body;

    if (!teamName) {
      return res.status(400).json({ msg: "Team name is required" });
    }

    const user = await User.findById(req.user.id);

    const team = await Team.create({
      teamName,
      description,
      leaderId: req.user.id,
      leaderName: user.name,
      leaderEmail: user.email,
      maxMembers: maxMembers || 10,
      isPublic: isPublic || false,
      members: [{
        userId: req.user.id,
        name: user.name,
        email: user.email,
        status: "accepted"
      }]
    });

    res.status(201).json({
      msg: "Team created successfully",
      team,
      teamCode: team.teamCode
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ msg: "Error creating team" });
  }
});

// 👥 JOIN team via code
router.post("/join/:teamCode", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({ teamCode: req.params.teamCode });

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Check if already member
    const isMember = team.members.some(m => m.userId.toString() === req.user.id);
    if (isMember) {
      return res.status(400).json({ msg: "Already a team member" });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ msg: "Team is full" });
    }

    const user = await User.findById(req.user.id);

    team.members.push({
      userId: req.user.id,
      name: user.name,
      email: user.email,
      status: "accepted"
    });

    await team.save();

    res.json({
      msg: "Joined team successfully",
      team
    });
  } catch (error) {
    console.error("Error joining team:", error);
    res.status(500).json({ msg: "Error joining team" });
  }
});

// 👥 GET user's teams
router.get("/my-teams", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      "members.userId": req.user.id
    }).populate("registeredEvents");

    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ msg: "Error fetching teams" });
  }
});

// 👥 GET team details
router.get("/:teamId", async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate("registeredEvents")
      .populate("members.userId");

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ msg: "Error fetching team" });
  }
});

// 👥 REMOVE member from team
router.post("/:teamId/remove/:memberId", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Only leader can remove members
    if (team.leaderId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    team.members = team.members.filter(
      m => m.userId.toString() !== req.params.memberId
    );

    await team.save();

    res.json({ msg: "Member removed", team });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ msg: "Error removing member" });
  }
});

// 👥 REGISTER team for event
router.post("/:teamId/register/:eventId", authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    // Only leader can register team
    if (team.leaderId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Add event to team
    if (!team.registeredEvents.includes(req.params.eventId)) {
      team.registeredEvents.push(req.params.eventId);
      await team.save();
    }

    res.json({ msg: "Team registered for event", team });
  } catch (error) {
    console.error("Error registering team:", error);
    res.status(500).json({ msg: "Error registering team" });
  }
});

module.exports = router;
