// routes/genre.routes.ts

import { Router } from 'express';
import { ObjectId } from 'mongodb';

import { AppError } from '../errors/app.error';
import { genreService } from '../services/genre.service';

const router = Router();

// GET /api/genres
router.get('/', async (_req, res) => {
	const genres = await genreService.getAllGenres();

	res.json(genres);
});

// GET /api/genres/:id
router.get('/:id', async (req, res) => {
	const { id } = req.params;

	if (!ObjectId.isValid(id)) {
		throw new AppError(400, 'Invalid genre ID.');
	}

	const genre = await genreService.getGenreById(id);

	if (!genre) {
		throw new AppError(404, 'Genre not found.');
	}

	res.json(genre);
});

export default router;
