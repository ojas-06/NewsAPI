import express from "express";
import getHeadlines from "../controllers/getHeadlines";

export const auth = express.Router();

auth.get("/",getHeadlines);