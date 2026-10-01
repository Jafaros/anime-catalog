import type { Genre } from '#lib/models/genre.ts';

export class GenreApi {
	public static async getAll(fn?: typeof fetch): Promise<Genre[]> {
		const response = await (fn || fetch)('/api/genres');

		if (!response.ok) {
			throw new Error('Failed to load genres.');
		}

		return response.json();
	}

	public static async getById(id: string, fn?: typeof fetch): Promise<Genre> {
		const response = await (fn || fetch)(`/api/genres/${id}`);

		if (!response.ok) {
			throw new Error('Failed to load genre.');
		}

		return response.json();
	}
}
