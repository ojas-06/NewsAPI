# The Daily Source API (Backend)

The Express.js backend for "The Daily Source" news aggregator. It acts as a secure proxy for the News API, manages a MongoDB caching system to prevent API rate-limiting, and interfaces with the Gemini API for article summarization.

## Features
* **Smart Database Caching:** Automatically caches Top Headlines and Category News in MongoDB. Refreshes data dynamically only if the cache is older than 24 hours.
* **Search Proxy:** Handles user search queries directly via the NewsAPI without bloating the database with random search data.
* **AI Integration:** Features a dedicated `/view/summary/:id` endpoint that passes article content to the Google Gemini API for intelligent summarization.
* **Optimized Queries:** Uses Mongoose `.findOne()` and `.insertMany()` efficiently to minimize RAM usage and database read/writes.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **External APIs:** NewsAPI.org, Google Gemini API
* **Utilities:** `node-fetch`, `dotenv`

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ojas-06/NewsAPI
   cd NewsAPI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory. You will need API keys from NewsAPI and Google Gemini, plus your MongoDB connection string.
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/news-app
   NEWS_API_KEY=your_news_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/home` | Fetches Top-Headlines and default category - Business news from DB / API |
| `GET` | `/home/:categoryName` | Fetches category news (serves from DB cache if < 24 hrs old). |
| `GET` | `/search/:query` | Secure proxy to fetch live search results from NewsAPI. |
| `GET` | `/view/:articleID` | View full article content parsed from some news website using `JSDOM`. |
| `GET` | `/view/summary/:articleID` | Triggers Gemini API to generate a 3-point summary for a specific article. |
