import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { home } from "./routes/home.js";
import { view } from "./routes/view.js";
import test from "./routes/root.js";
import { search } from "./routes/search.js";

const allowedOrigins = [
  'https://news-mern.netlify.app',
  'http://localhost:5173',
  'http://localhost:5173/',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5173/'                    
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  }
}));

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/", test);

app.use("/home", home);

app.use("/view", view);

app.use('/search',search);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

export default app;
