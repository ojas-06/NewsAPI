import fetch from "node-fetch";
import Article from "../models/Article.js";

export default async function getHomePageData(req, res) {
  try {
    const headlines = await getHeadlines();
    const categoryNews = await getArticleByCategory(
      req.params.categoryName || "business",
    );

    res.status(200).json({
      headlines: headlines,
      categoryNews: categoryNews,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error at getHomePageData" });
  }
}

async function getHeadlines() {
  const API_KEY = process.env.NEWS_API_KEY;
  const CATEGORY_NAME = "top-headlines";
  try {
    const cachedHeadlines = await Article.find({ category: CATEGORY_NAME });
    if (cachedHeadlines.length > 0) {
      return cachedHeadlines;
    } else {
      const response = await fetch(
        "https://newsapi.org/v2/top-headlines?country=us",
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        },
      );

      if (!response.ok) {
        console.error("Cannot fetch from NewsAPI..", process.env.NEWS_API_KEY);
        return { error: "response not received from NewsAPI" };
      }
      const data = await response.json();
      const formattedData = data.articles.map((article) => {
        return {
          imageUrl: article.urlTomage,
          title: article.title,
          short: article.description,
          content: "",
          author: article.author,
          summary: "",
          sourceUrl: article.url,
          category: CATEGORY_NAME,
        };
      });
      await Article.insertMany(formattedData);
      return formattedData;
    }
  } catch (err) {
    console.error("Failed in getHeadlines controller, ", err);
    return {};
  }
}

async function getArticleByCategory(category) {
  const API_KEY = process.env.NEWS_API_KEY;
  var CATEGORY_NAME;

  const categories = [
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
    const cachedNews = await Article.find({ category: CATEGORY_NAME });
    if (cachedNews.length > 0) {
      return cachedNews;
    } else {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${CATEGORY_NAME}`,
        {
          headers: {
            "X-API-KEY": API_KEY,
          },
        },
      );

      if (!response.ok) {
        console.error("Cannot fetch from NewsAPI..", API_KEY);
        return { error: "response not received from NewsAPI" };
      }
      const data = await response.json();

      const formattedData = data.articles.map((article) => {
        return {
          imageUrl: article.urlToImage,
          title: article.title,
          short: article.description,
          content: "",
          author: article.author,
          summary: "",
          sourceUrl: article.url,
          category: CATEGORY_NAME,
        };
      });

      await Article.insertMany(formattedData);
      return formattedData;
    }
  } catch (err) {
    return { error: err };
  }
}
