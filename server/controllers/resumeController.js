const Interview = require("../models/Interview");

const {
  extractResumeText,
  analyzeResume,
} = require("../services/resumeService");

const {
  generateInterviewQuestions,
} = require("../services/geminiService");

const analyzeResumeAndCreateInterview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    const {
      difficulty = "Medium",
      type = "Technical",
      questionCount = 5,
      duration = 20,
      role,
    } = req.body;

    const resumeText = await extractResumeText(req.file.buffer);

    const resumeAnalysis = await analyzeResume(resumeText);

    const selectedRole =
      role ||
      resumeAnalysis.suggestedRoles?.[0] ||
      "Software Developer";

    const questions =
      await generateInterviewQuestions({
        role: selectedRole,
        difficulty,
        type,
        questionCount: Number(questionCount),
        resumeContext: resumeAnalysis,
      });

    const interview = await Interview.create({
      user: req.user._id,
      role: selectedRole,
      difficulty,
      type,
      questionCount: Number(questionCount),
      duration: Number(duration),
      status: "in-progress",
      questions: questions.map((q) => ({
        question: q.question,
        category: q.category || "Resume",
        answer: "",
        feedback: "",
        idealAnswer: "",
        score: 0,
      })),
    });

    return res.status(201).json({
      success: true,
      message: "Resume interview created successfully",
      resumeAnalysis,
      interview,
    });
  } catch (error) {
    console.error("Resume interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create resume interview",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeResumeAndCreateInterview,
};