import { connectDB } from "./config/db.js";
import express from "express";
import { home } from "./routes/home.js";
import dotenv from "dotenv";
import { auth } from "./routes/auth.js";
import { view } from "./routes/view.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/homepage", home);

app.use("/user",auth)

app.use("/view",view)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
