import axios from "axios";
import Article from "../models/Article.js";

export async function parseArticle(req, res) {
  try {
    const articleID = req.params.id;
    const article = await Article.findById(articleID);
    if (article.content.length > 0) {
      console.log("reused");
      res.status(200).json(article);
    }
    const url = await article.sourceUrl;
    if (!url) {
      console.error("Missing article URL, failed at parseArticle.");
      res
        .status(500)
        .json({ message: "Article details could not be fetched." });
      return;
    }
    const { JSDOM } = await import("jsdom");
    const { Readability } = await import("@mozilla/readability");

    const articleResponse = await axios.get(url, { timeout: 8000 });

    const dom = new JSDOM(articleResponse.data, {
      url: url,
    });

    const articleObject = new Readability(dom.window.document).parse();
    const dbResponse = await Article.findByIdAndUpdate(
      articleID,
      { content: articleObject.textContent },
      { new: true },
    );

    res.status(200).json(dbResponse);
  } catch (err) {
    let errorMessage = "Unknown error";
    if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
      errorMessage = "Timeout: The article took too long to load";
    } else if (err.message) {
      errorMessage = err.message;
    }

    res.status(500).json({
      message: errorMessage,
    });
  }
}
