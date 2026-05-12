import express from "express";
import getHomePageData from "../controllers/getHomePageData.js";

export const home = express.Router();

home.get("/", getHomePageData);
home.get("/:categoryName", getHomePageData);
