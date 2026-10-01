// models/anime.model.ts

import { ObjectId } from 'mongodb';

export type AnimeFormat = 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL';

export type AnimeStatus =
	| 'FINISHED'
	| 'RELEASING'
	| 'NOT_YET_RELEASED'
	| 'CANCELLED';

export interface Anime {
	_id?: ObjectId;
	title: string;
	english_title?: string;
	description: string;
	episodes: number;
	format: AnimeFormat;
	release_year: number;
	status: AnimeStatus;
	image_url: string;
	backdrop_url: string;
	genre_ids: ObjectId[];
}
