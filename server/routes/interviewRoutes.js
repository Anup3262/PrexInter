const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  generateQuestions,
  saveAnswer,
  evaluateInterview,
  
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/", protect, createInterview);
router.get("/", protect, getInterviews);

router.post(
  "/:id/generate-questions",
  protect,
  generateQuestions
);

router.put(
  "/:id/answer",
  protect,
  saveAnswer
);

router.post(
  "/:id/evaluate",
  protect,
  evaluateInterview
);

router.get("/:id", protect, getInterviewById);
router.put("/:id", protect, updateInterview);
router.delete("/:id", protect, deleteInterview);

module.exports = router;