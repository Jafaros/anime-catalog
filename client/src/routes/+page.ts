import { AnimeApi } from '#lib/api/anime.api.ts';

export const load = async ({ fetch, depends }) => {
	depends('anime:all');

	const anime = await AnimeApi.getAll(fetch);

	return { anime };
};
