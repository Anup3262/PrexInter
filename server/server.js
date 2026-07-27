require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

console.log(
  "Gemini key loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to PrexInter API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    project: "PrexInter",
    message: "Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`PrexInter server running on port ${PORT}`);
  });
});