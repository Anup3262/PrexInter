const Interview = require("../models/Interview");

const getAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id,
    });

    const totalInterviews = interviews.length;

    const completed = interviews.filter(
      (i) => i.status === "completed"
    );

    const completedCount = completed.length;

    const averageScore =
      completedCount > 0
        ? Math.round(
            completed.reduce(
              (sum, item) => sum + (item.score || 0),
              0
            ) / completedCount
          )
        : 0;

    const bestScore =
      completedCount > 0
        ? Math.max(...completed.map((i) => i.score || 0))
        : 0;

    const completionRate =
      totalInterviews > 0
        ? Math.round(
            (completedCount / totalInterviews) * 100
          )
        : 0;

    const difficulty = {
      Easy: interviews.filter(
        (i) => i.difficulty === "Easy"
      ).length,
      Medium: interviews.filter(
        (i) => i.difficulty === "Medium"
      ).length,
      Hard: interviews.filter(
        (i) => i.difficulty === "Hard"
      ).length,
    };

    const types = {
      Technical: interviews.filter(
        (i) => i.type === "Technical"
      ).length,
      HR: interviews.filter(
        (i) => i.type === "HR"
      ).length,
      Behavioral: interviews.filter(
        (i) => i.type === "Behavioral"
      ).length,
      Mixed: interviews.filter(
        (i) => i.type === "Mixed"
      ).length,
    };

    return res.json({
      success: true,
      analytics: {
        totalInterviews,
        completedCount,
        averageScore,
        bestScore,
        completionRate,
        difficulty,
        types,
        interviews,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to load analytics",
    });
  }
};

module.exports = {
  getAnalytics,
};