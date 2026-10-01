import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import app from '../src/app';
import { connectDatabase, disconnectDatabase } from '../src/database/mongo';

beforeAll(async () => {
	await connectDatabase();
});

afterAll(async () => {
	await disconnectDatabase();
});

describe('GET /api/genres', () => {
	it('returns genres', async () => {
		const response = await request(app).get('/api/genres').expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBeGreaterThan(0);
	});
});

describe('GET /api/genres/:id', () => {
	it('returns genre by ID', async () => {
		const genresResponse = await request(app)
			.get('/api/genres')
			.expect(200);

		const genre = genresResponse.body[0];

		const response = await request(app)
			.get(`/api/genres/${genre._id}`)
			.expect(200);

		expect(response.body._id).toBe(genre._id);
		expect(response.body.name).toBe(genre.name);
	});
});
