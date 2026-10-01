// services/genre.service.ts

import { Collection, ObjectId, type Db } from 'mongodb';

import { getDatabase } from '../database/mongo';
import type { Genre } from '../models/genre.model';

export class GenreService {
	private get collection(): Collection<Genre> {
		return getDatabase().collection<Genre>('genres');
	}

	public async getAllGenres(): Promise<Genre[]> {
		return this.collection.find().sort({ name: 1 }).toArray();
	}

	public async getGenreById(id: string): Promise<Genre | null> {
		if (!ObjectId.isValid(id)) {
			return null;
		}

		return this.collection.findOne({
			_id: new ObjectId(id),
		});
	}

	public async createGenre(genre: Genre): Promise<Genre> {
		const result = await this.collection.insertOne(genre);
		return { ...genre, _id: result.insertedId };
	}

	public async updateGenre(id: string, genre: Genre): Promise<Genre | null> {
		if (!ObjectId.isValid(id)) {
			return null;
		}

		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: genre },
		);

		return result.modifiedCount > 0
			? { ...genre, _id: new ObjectId(id) }
			: null;
	}

	public async deleteGenre(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) {
			return false;
		}

		const result = await this.collection.deleteOne({
			_id: new ObjectId(id),
		});

		return result.deletedCount > 0;
	}
}

export const genreService = new GenreService();
