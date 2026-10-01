// tests/anime.test.ts

import request from 'supertest';

import app from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/database/mongo';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

beforeAll(async () => {
	await connectDatabase();
});

afterAll(async () => {
	await disconnectDatabase();
});

describe('GET /api/anime', () => {
	it('returns anime', async () => {
		const response = await request(app).get('/api/anime').expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBeGreaterThan(0);
	});
});

describe('GET /api/anime/:id', () => {
	it('returns 400 for an invalid ObjectId', async () => {
		const response = await request(app)
			.get('/api/anime/unga-bunga')
			.expect(400);

		expect(response.body.message).toBe('Invalid anime ID.');
	});

	it('returns 404 for a missing anime', async () => {
		await request(app)
			.get('/api/anime/507f1f77bcf86cd799439011')
			.expect(404);
	});
});

describe('GET /api/anime/search', () => {
	it('searches anime using the text index', async () => {
		const response = await request(app)
			.get('/api/anime/search')
			.query({ query: 'Monster' })
			.expect(200);

		expect(
			response.body.some(
				(anime: { title: string }) => anime.title === 'Monster',
			),
		).toBe(true);
	});
});

describe('Anime CRUD', () => {
	it('creates, updates and deletes an anime', async () => {
		// CREATE
		const createResponse = await request(app)
			.post('/api/anime')
			.field('title', 'Test Anime')
			.field('english_title', 'Test Anime')
			.field(
				'description',
				'Temporary anime created by integration test.',
			)
			.field('episodes', '12')
			.field('format', 'TV')
			.field('release_year', '2026')
			.field('status', 'FINISHED')
			.field('genre_ids', JSON.stringify([]))
			.expect(201);

		const id = createResponse.body._id;

		expect(id).toBeDefined();
		expect(createResponse.body.title).toBe('Test Anime');

		// READ
		const readResponse = await request(app)
			.get(`/api/anime/${id}`)
			.expect(200);

		expect(readResponse.body.title).toBe('Test Anime');

		// UPDATE
		const updateResponse = await request(app)
			.put(`/api/anime/${id}`)
			.field('title', 'Updated Test Anime')
			.field('english_title', 'Updated Test Anime')
			.field('description', 'Updated by integration test.')
			.field('episodes', '24')
			.field('format', 'TV')
			.field('release_year', '2026')
			.field('status', 'FINISHED')
			.field('genre_ids', JSON.stringify([]))
			.expect(200);

		expect(updateResponse.body.title).toBe('Updated Test Anime');
		expect(updateResponse.body.episodes).toBe(24);

		// VERIFY UPDATE
		const updatedResponse = await request(app)
			.get(`/api/anime/${id}`)
			.expect(200);

		expect(updatedResponse.body.title).toBe('Updated Test Anime');
		expect(updatedResponse.body.episodes).toBe(24);

		// DELETE
		await request(app).delete(`/api/anime/${id}`).expect(204);

		// VERIFY DELETE
		await request(app).get(`/api/anime/${id}`).expect(404);
	});
});
