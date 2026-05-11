import express from "express";
import getHeadlines from "../controllers/getHeadlines";

export const home = express.Router();

home.get("/",getHeadlines);

