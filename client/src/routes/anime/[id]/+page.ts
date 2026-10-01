import { AnimeApi } from '#lib/api/anime.api.ts';

export const load = async ({ fetch, params, parent, depends }) => {
	depends(`anime:${params.id}`);

	const anime = await AnimeApi.getById(params.id, fetch);

	const parentData = await parent();
	const genres = parentData.genres;

	return { anime, genres };
};
