import { GoogleGenAI } from "@google/genai";
import Article from "../models/Article.js";
import { parseByArticleID } from "./parseArticle.js";

export default async function summarizer(req, res) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    if (!article) {
      res.status(500).json({
        message: "Something wrong with the database, failed at summarizer.",
      });
      return;
    }
    const summary = await article.summary;
    if (summary.length > 0) {
      res.status(200).json(article);
      return;
    }
    let content;
    if (!article.content.length) {
      const response = await parseByArticleID(id);
      if (response.status === 200) {
        content = await response.json.content;
      } else {
        res.status(response.status).json(response.json);
        return;
      }
    } else {
      content = await article.content;
    }
    const contents = [
      {
        parts: [
          {
            text: `Summarize the following in three bullet points:\n${content}`,
          },
        ],
      },
    ];
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    const result = await response.text;

    const summarizedArticle = await Article.findByIdAndUpdate(
      id,
      { summary: result },
      { returnDocument: "after" },
    );
    res.status(200).json(summarizedArticle);
  } catch (error) {
    if (error && error.error && error.error.message) {
      console.error("Gemini API Error:", error.error.message);
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error object:", error);
    }
    res.status(500).json({ message: "Summarization failed." });
  }
}
