require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://prex-inter.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedPreviewOrigin =
        /^https:\/\/prex-inter-[a-z0-9-]+-anup10\.vercel\.app$/.test(
          origin
        );

      if (
        allowedOrigins.includes(origin) ||
        isAllowedPreviewOrigin
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
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

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `PrexInter server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Unable to start server:",
      error.message
    );
    process.exit(1);
  });