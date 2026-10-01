import type { Anime, AnimeFormData } from '#lib/models/anime.ts';

export class AnimeApi {
	public static async getAll(fn?: typeof fetch): Promise<Anime[]> {
		const response = fn ? await fn('/api/anime') : await fetch('/api/anime');

		if (!response.ok) {
			throw new Error('Failed to load anime.');
		}

		return response.json();
	}

	public static async getById(id: string, fn?: typeof fetch): Promise<Anime> {
		const response = fn ? await fn(`/api/anime/${id}`) : await fetch(`/api/anime/${id}`);

		if (!response.ok) {
			throw new Error('Failed to load anime.');
		}

		return response.json();
	}

	public static async search(query: string, fn?: typeof fetch): Promise<Anime[]> {
		const response = fn
			? await fn(`/api/anime/search?query=${encodeURIComponent(query)}`)
			: await fetch(`/api/anime/search?query=${encodeURIComponent(query)}`);

		if (!response.ok) {
			throw new Error('Failed to search anime.');
		}

		return response.json();
	}

	public static async create(data: AnimeFormData): Promise<Anime> {
		const response = await fetch('/api/anime', {
			method: 'POST',
			body: this.toFormData(data)
		});

		if (!response.ok) {
			throw new Error('Failed to create anime.');
		}

		return response.json();
	}

	public static async update(id: string, data: AnimeFormData): Promise<Anime> {
		const response = await fetch(`/api/anime/${id}`, {
			method: 'PUT',
			body: this.toFormData(data)
		});

		if (!response.ok) {
			throw new Error('Failed to update anime.');
		}

		return response.json();
	}

	public static async delete(id: string): Promise<void> {
		const response = await fetch(`/api/anime/${id}`, {
			method: 'DELETE'
		});

		if (!response.ok) {
			throw new Error('Failed to delete anime.');
		}
	}

	private static toFormData(data: AnimeFormData): FormData {
		const form = new FormData();

		form.set('title', data.title);
		form.set('english_title', data.english_title);
		form.set('description', data.description);
		form.set('episodes', String(data.episodes));
		form.set('format', data.format);
		form.set('release_year', String(data.release_year));
		form.set('status', data.status);
		form.set('genre_ids', JSON.stringify(data.genre_ids));

		if (data.image) {
			form.set('image', data.image);
		}

		return form;
	}
}
