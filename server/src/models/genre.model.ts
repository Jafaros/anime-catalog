// models/genre.model.ts

import { ObjectId } from 'mongodb';

export interface Genre {
	_id?: ObjectId;
	name: string;
	description: string;
	slug: string;
}
