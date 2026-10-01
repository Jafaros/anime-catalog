import { GenreApi } from '#lib/api/genre.api.ts';

export const ssr = false;

export const load = async ({ fetch, depends }) => {
	depends('genre:all');

	const genres = await GenreApi.getAll(fetch);

	return { genres };
};
