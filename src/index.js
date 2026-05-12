import "dotenv/config";

import { connectDB } from "./config/db.js";
import express from "express";
import { home } from "./routes/home.js";

import { auth } from "./routes/auth.js";
import { view } from "./routes/view.js";
import test from "./routes/root.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/", test);

app.use("/home", home);

app.use("/view", view);

// app.use("/user", auth);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}

export default app;
