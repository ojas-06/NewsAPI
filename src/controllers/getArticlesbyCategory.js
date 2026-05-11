import fetch from "node-fetch";
import Article from "../models/Article.js";

const API_KEY = process.env.NEWS_API_KEY;

const CACHE_EXPIRATION_TIME = 20 * 60 * 1000;

async function getArticleByCategory(category) {
  var CATEGORY_NAME;

  categories = [
    "business",
    "technology",
    "science",
    "health",
    "sports",
    "entertainment",
  ];

  if (!categories.includes(category.toLowerCase())) {
    CATEGORY_NAME = "business";
    console.log("Queried category not found, default: business");
  } else CATEGORY_NAME = category.toLowerCase();
  
  try {
    const cachedNews = await Article.findMany({ category: CATEGORY_NAME });
    if (cachedNews) {
      res.status(200).json(cachedNews);
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
