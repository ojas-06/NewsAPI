import fetch from "node-fetch";
import Article from "../models/Article.js";

const API_KEY = process.env.NEWS_API_KEY;

function filter_news(newsList) {}

export default async function getHeadlines(_, res) {
  const CATEGORY_NAME = "top-headlines";
  try {
    const cachedHeadlines = await Article.findMany({ category: CATEGORY_NAME });
    if (cachedHeadlines) {
      res.status(200).json(cachedHeadlines);
    } else {
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?country=us",
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        },
      );

      if (!response.ok()) {
        console.error("Cannot fetch from NewsAPI..");
        res
          .status(500)
          .json({ message: "External API Error. Please try again later" });
        return;
      }

      const data = await response.json();

      const formattedData = data.articles.map((article) => {
        ((imageUrl = article.urlToImage),
          (title = article.title),
          (short = article.description),
          (content = ""),
          (author = article.author),
          (summary = ""),
          (sourceUrl = article.url),
          (category = CATEGORY_NAME));
      });

      res.status(200).json(formattedData);

      await Article.insertMany({ formattedData });
    }
  } catch (err) {
    console.error("Failed in getHeadlines controller, ", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
