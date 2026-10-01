// app.ts

import express from 'express';
import cors from 'cors';
import animeRouter from './routes/anime.routes';
import genreRouter from './routes/genre.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(
	cors({
		origin: '*', // For development, allow all origins. In production, specify the allowed origin(s).
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/api/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/anime', animeRouter);
app.use('/api/genres', genreRouter);

app.use(errorHandler);

export default app;
