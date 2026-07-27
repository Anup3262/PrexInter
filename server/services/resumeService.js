const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const extractResumeText = async (buffer) => {
  let parser;

  try {
    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();
    const text = result.text?.trim();

    if (!text) {
      throw new Error(
        "No readable text was found in the resume PDF"
      );
    }

    return text;
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

const analyzeResume = async (resumeText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not loaded");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are a technical recruiter.

Analyze the following resume and return only valid JSON.

Resume:
${resumeText.slice(0, 15000)}

Return this exact structure:

{
  "candidateName": "",
  "summary": "",
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],
  "experience": [],
  "suggestedRoles": []
}

Rules:
- Use only information present in the resume.
- Do not invent details.
- Return valid JSON only.
- Do not include markdown or code fences.
`,
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error(
      "Gemini returned an empty resume analysis"
    );
  }

  const cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini resume response:", rawText);
    throw new Error(
      "Gemini returned invalid resume analysis JSON"
    );
  }
};

module.exports = {
  extractResumeText,
  analyzeResume,
};