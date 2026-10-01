// routes/anime.routes.ts

import { Router } from 'express';
import { ObjectId } from 'mongodb';

import { AppError } from '../errors/app.error';
import { uploadAnimeImage } from '../middleware/upload.middleware';
import { animeService } from '../services/anime.service';
import { deleteAnimeImage, saveAnimeImage } from '../utils/image';
import { animeSchema } from '../schemas/anime.schema';

const router = Router();

// GET /api/anime
router.get('/', async (_req, res) => {
	const anime = await animeService.getAllAnime();

	res.json(anime);
});

// GET /api/anime/search?query=frieren
router.get('/search', async (req, res) => {
	const query = req.query.query as string;

	if (typeof query !== 'string' || !query.trim()) {
		throw new AppError(400, 'Search query is required.');
	}

	const anime = await animeService.searchAnimeByTitle(query);

	res.json(anime);
});

// GET /api/anime/:id
router.get('/:id', async (req, res) => {
	const { id } = req.params;

	if (!ObjectId.isValid(id)) {
		throw new AppError(400, 'Invalid anime ID.');
	}

	const anime = await animeService.getAnimeById(id);

	if (!anime) {
		throw new AppError(404, 'Anime not found.');
	}

	res.json(anime);
});

// POST /api/anime
router.post('/', uploadAnimeImage, async (req, res) => {
	const data = animeSchema.parse(req.body);

	let imageUrl: string = '';

	if (req.file) {
		imageUrl = await saveAnimeImage(req.file);
	}

	// We'll properly validate/map multipart fields next.
	const anime = await animeService.createAnime({
		...data,
		image_url: imageUrl,
	});

	res.status(201).json(anime);
});

// PUT /api/anime/:id
router.put('/:id', uploadAnimeImage, async (req, res) => {
	const { id } = req.params as { id: string };
	const data = animeSchema.parse(req.body);

	if (!ObjectId.isValid(id)) {
		throw new AppError(400, 'Invalid anime ID.');
	}

	const existingAnime = await animeService.getAnimeById(id);

	if (!existingAnime) {
		throw new AppError(404, 'Anime not found.');
	}

	let imageUrl = existingAnime.image_url;

	if (req.file) {
		imageUrl = await saveAnimeImage(req.file);
	}

	const anime = await animeService.updateAnime(id, {
		...data,
		image_url: imageUrl,
	});

	if (req.file && existingAnime.image_url) {
		await deleteAnimeImage(existingAnime.image_url);
	}

	res.json(anime);
});

// DELETE /api/anime/:id
router.delete('/:id', async (req, res) => {
	const { id } = req.params as { id: string };

	if (!ObjectId.isValid(id)) {
		throw new AppError(400, 'Invalid anime ID.');
	}

	const anime = await animeService.getAnimeById(id);

	if (!anime) {
		throw new AppError(404, 'Anime not found.');
	}

	await animeService.deleteAnime(id);

	if (anime.image_url) {
		await deleteAnimeImage(anime.image_url);
	}

	res.status(204).send();
});

export default router;
