import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function summarizer({ content }) {
  try {
    const contents = [
      {
        parts: [
          {
            text: `Summarize the following in 3 bullet points:\n${content}`,
          },
        ],
      },
    ];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    const result = await response.text;
  } catch {
    if (error && error.error && error.error.message) {
      console.error("Gemini API Error:", error.error.message);
      alert(`❌ Gemini API Error: ${error.error.message}`);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
      alert(`❌ Unexpected Error: ${error.message}`);
    } else {
      console.error("Unknown error object:", error);
      alert("❌ An unknown error occurred.");
    }
  }
}

export default summarizer;
