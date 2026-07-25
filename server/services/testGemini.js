require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
  console.log("Test started");
  console.log("API key loaded:", Boolean(process.env.GEMINI_API_KEY));

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Reply exactly: Gemini is working",
    });

    console.log("Response received:");
    console.log(response.text);
  } catch (error) {
    console.error("Gemini request failed:");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error(error);
  }
}

testGemini();