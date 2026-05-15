import express from "express";

export const search = express.Router();

search.get("/:query", async (req, res) => {
  try {
    const query = req.params.query;
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}`,
      {
        headers: {
          "X-API-KEY": process.env.NEWS_API_KEY,
        },
      },
    );
    

    if (!response.ok) {
      res.status(500).json({ message: "API Error on search endpoint" });
      return;
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
        category: query,
      };
    });
    

    res.status(200).json({
      results: formattedData,
    });
    

    return;
  } catch (error) {
    res.status(500).json({ error: "Server error at search" });
  }
});
