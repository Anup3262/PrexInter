const { GoogleGenAI } = require("@google/genai");

const generateInterviewQuestions = async ({
  role,
  difficulty,
  type,
  questionCount,
}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not loaded");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const safeQuestionCount = Number(questionCount) || 5;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are an experienced interview evaluator.

Generate exactly ${safeQuestionCount} interview questions.

Job role: ${role}
Difficulty: ${difficulty}
Interview type: ${type}

Return only valid JSON using this exact format:

[
  {
    "question": "Interview question",
    "category": "Relevant category"
  }
]

Requirements:
- Return exactly ${safeQuestionCount} questions.
- Do not include answers.
- Do not include Markdown.
- Do not include code fences.
- Do not include explanations before or after the JSON.
- Avoid duplicate questions.
- Match the selected role and difficulty.
`,
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("Gemini returned an empty response");
  }

  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let questions;

  try {
    questions = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini raw response:", rawText);
    throw new Error("Gemini returned invalid JSON");
  }

  if (!Array.isArray(questions)) {
    throw new Error("Gemini response is not an array");
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
        typeof item.category === "string" &&
        item.category.trim()
          ? item.category.trim()
          : type || "General",
    }));

  if (validQuestions.length === 0) {
    throw new Error("Gemini returned no valid questions");
  }

  return validQuestions;
};

const evaluateInterviewAnswers = async ({ role, difficulty, questions }) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not loaded");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are an experienced interview evaluator.

Evaluate the candidate's answers for this interview.

Role: ${role}
Difficulty: ${difficulty}

Questions and answers:
${JSON.stringify(
  questions.map((item, index) => ({
    index,
    question: item.question,
    answer: item.answer || "",
  })),
  null,
  2
)}

Return only valid JSON in this exact format:

{
  "overallScore": 0,
  "summary": "Overall feedback",
  "results": [
    {
      "questionIndex": 0,
      "score": 0,
      "feedback": "Specific feedback",
      "idealAnswer": "A strong example answer"
    }
  ]
}

Rules:
- Score every answer from 0 to 10.
- overallScore must be from 0 to 100.
- Include one result for every question.
- Penalize empty or irrelevant answers.
- Do not include markdown or code fences.
`,
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("Gemini returned an empty evaluation");
  }

  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const evaluation = JSON.parse(cleanedText);

  if (
    !evaluation ||
    !Array.isArray(evaluation.results)
  ) {
    throw new Error("Gemini returned an invalid evaluation");
  }

  return evaluation;
};

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
};