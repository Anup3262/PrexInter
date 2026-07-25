const Interview = require("../models/Interview");

const {
  generateInterviewQuestions,
} = require("../services/geminiService");

const createInterview = async (req, res) => {
  try {
    const {
      role,
      difficulty,
      type,
      questionCount,
      duration,
    } = req.body;

    if (!role || !difficulty || !type) {
      return res.status(400).json({
        success: false,
        message: "Role, difficulty and interview type are required",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      role,
      difficulty,
      type,
      questionCount: questionCount || 5,
      duration: duration || 20,
    });

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create interview",
      error: error.message,
    });
  }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch interviews",
      error: error.message,
    });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Get interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch interview",
      error: error.message,
    });
  }
};

const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const allowedFields = [
      "role",
      "difficulty",
      "type",
      "questionCount",
      "duration",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    console.error("Update interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update interview",
      error: error.message,
    });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    await interview.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Delete interview error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete interview",
      error: error.message,
    });
  }
};

const generateQuestions = async (req, res) => {
  try {
    console.log("Generate questions request received");

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    console.log("Interview found:", interview._id.toString());

    const generatedQuestions = await generateInterviewQuestions({
      role: interview.role,
      difficulty: interview.difficulty,
      type: interview.type,
      questionCount: interview.questionCount,
    });

    if (
      !Array.isArray(generatedQuestions) ||
      generatedQuestions.length === 0
    ) {
      return res.status(502).json({
        success: false,
        message: "Gemini did not return valid questions",
      });
    }

    interview.questions = generatedQuestions.map((item) => ({
      question: item.question,
      category: item.category || interview.type,
      answer: "",
      feedback: "",
      score: 0,
    }));

    interview.status = "in-progress";

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Questions generated successfully",
      count: interview.questions.length,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Generate questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate interview questions",
      error: error.message,
    });
  }
};

const saveAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;

    if (!Number.isInteger(questionIndex)) {
      return res.status(400).json({
        success: false,
        message: "questionIndex must be an integer",
      });
    }

    if (typeof answer !== "string") {
      return res.status(400).json({
        success: false,
        message: "Answer must be text",
      });
    }

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (
      questionIndex < 0 ||
      questionIndex >= interview.questions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid question index",
      });
    }

    interview.questions[questionIndex].answer = answer.trim();

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Answer saved successfully",
      question: interview.questions[questionIndex],
    });
  } catch (error) {
    console.error("Save answer error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save answer",
      error: error.message,
    });
  }
};

module.exports = {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  generateQuestions,
  saveAnswer,
};