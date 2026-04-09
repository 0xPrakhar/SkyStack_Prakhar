const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const seedData = require("./seed");

dotenv.config();
connectDB();
seedData();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Event Hub API - Running Successfully!")
})

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/events", require("./Routes/EventRoutes"));
app.use("/api/bookings", require("./Routes/BookingRoutes"));
app.use("/api/tickets", require("./Routes/TicketRoutes"));
app.use("/api/checkin", require("./Routes/CheckInRoutes"));
app.use("/api/teams", require("./Routes/TeamRoutes"));

app.listen(5000, () => console.log("Server running on port 5000"))