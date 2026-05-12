import express from 'express';
import { parseArticle } from '../controllers/parseArticle.js';

export const view = express.Router();

view.get('/:id', parseArticle);