import express from 'express';
import { parseArticle } from '../controllers/parseArticle.js';
import summarizer from '../controllers/summarizer.js';

export const view = express.Router();

view.get('/:id', parseArticle);

view.get("/summary/:id",summarizer);