const express = require("express");
const protect = require("../middleware/authMiddleware");
const uploadResume = require("../middleware/uploadMiddleware");

const {
  analyzeResumeAndCreateInterview,
} = require("../controllers/resumeController");

const router = express.Router();

router.post(
  "/interview",
  protect,
  uploadResume.single("resume"),
  analyzeResumeAndCreateInterview
);

module.exports = router;