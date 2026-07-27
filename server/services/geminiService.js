const { GoogleGenAI } = require("@google/genai");

const getAIClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not loaded");
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};



const cleanJsonResponse = (text) => {
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const generateInterviewQuestions = async ({
  role,
  difficulty,
  type,
  questionCount,
  resumeContext = null,
}) => {

 
  const ai = getAIClient();
  const safeQuestionCount = Number(questionCount) || 5;

  const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `
You are an experienced technical interviewer.

Generate ${questionCount} ${difficulty} ${type} interview questions.

Role: ${role}

Resume context:
${
  resumeContext
    ? JSON.stringify(resumeContext, null, 2)
    : "No resume context provided"
}

Instructions:
- If resume context is available, ask questions based on the candidate's:
  - Skills
  - Projects
  - Experience
- Also include core interview questions for the selected role.
- Return exactly ${questionCount} questions.
- Return only valid JSON.

Format:
[
  {
    "question": "...",
    "category": "..."
  }
]
`,
});
  const cleanedText = cleanJsonResponse(response.text);

  let questions;

  try {
    questions = JSON.parse(cleanedText);
  } catch {
    console.error("Gemini question response:", response.text);
    throw new Error("Gemini returned invalid question JSON");
  }

  if (!Array.isArray(questions)) {
    throw new Error("Gemini question response is not an array");
  }

  const validQuestions = questions
    .filter(
      (item) =>
        item &&
        typeof item.question === "string" &&
        item.question.trim()
    )
    .slice(0, safeQuestionCount)
    .map((item) => ({
      question: item.question.trim(),
      category:
        typeof item.category === "string" && item.category.trim()
          ? item.category.trim()
          : type || "General",
    }));

  if (validQuestions.length === 0) {
    throw new Error("Gemini returned no valid questions");
  }

  return validQuestions;
};

const evaluateInterviewAnswers = async ({
  role,
  difficulty,
  type,
  questions,
}) => {
  const ai = getAIClient();

  const preparedQuestions = questions.map((item, index) => ({
    questionIndex: index,
    question: item.question,
    category: item.category || "General",
    candidateAnswer: item.answer?.trim() || "",
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are a senior technical interviewer and subject-matter expert.

Evaluate the candidate for this interview.

Role: ${role}
Difficulty: ${difficulty}
Interview type: ${type || "General"}

Questions and candidate answers:

${JSON.stringify(preparedQuestions, null, 2)}

Return only valid JSON in this exact format:

{
  "overallScore": 0,
  "summary": "Concise overall assessment",
  "results": [
    {
      "questionIndex": 0,
      "score": 0,
      "feedback": "Specific feedback about the candidate answer",
      "idealAnswer": "A complete and technically accurate model answer"
    }
  ]
}

Rules:
- Return one result for every question.
- score must be an integer from 0 to 10.
- overallScore must be an integer from 0 to 100.
- Give 0 or 1 for empty, irrelevant, or nonsensical answers.
- Do not praise incorrect statements.
- Explicitly identify mistakes.
- idealAnswer is required and must never be empty.
- idealAnswer must directly answer the exact question.
- Keep each idealAnswer between 80 and 180 words.
- Do not include markdown or code fences.
- When resume context is provided, include questions about the candidate's listed skills, projects, and experience.
`,
  });

  console.log("========== GEMINI RAW RESPONSE ==========");
console.log(response.text);
console.log("=========================================");

  const cleanedText = cleanJsonResponse(response.text);

  let evaluation;

  try {
    evaluation = JSON.parse(cleanedText);
  } catch {
    console.error("Gemini evaluation response:", response.text);
    throw new Error("Gemini returned invalid evaluation JSON");
  }

  if (
    !evaluation ||
    !Array.isArray(evaluation.results) ||
    evaluation.results.length !== questions.length
  ) {
    throw new Error("Gemini returned an incomplete evaluation");
  }

  evaluation.results = evaluation.results.map((result, index) => ({
    questionIndex: index,
    score: Math.max(
      0,
      Math.min(10, Math.round(Number(result.score) || 0))
    ),
    feedback:
      typeof result.feedback === "string" && result.feedback.trim()
        ? result.feedback.trim()
        : "No feedback generated.",
    idealAnswer:
      typeof result.idealAnswer === "string" &&
      result.idealAnswer.trim()
        ? result.idealAnswer.trim()
        : "No ideal answer generated.",
  }));

  evaluation.overallScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(Number(evaluation.overallScore) || 0)
    )
  );

  evaluation.summary =
    typeof evaluation.summary === "string" &&
    evaluation.summary.trim()
      ? evaluation.summary.trim()
      : "Interview evaluation completed.";

  return evaluation;
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
};