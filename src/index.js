import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { home } from "./routes/home.js";
import { view } from "./routes/view.js";
import test from "./routes/root.js";
import { search } from "./routes/search.js";

const app = express();
app.use(cors());
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
