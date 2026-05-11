import express from 'express';
import { parseArticle } from '../controllers/parseArticle';

export const view = express.Router();

view.get('/:id', parseArticle);