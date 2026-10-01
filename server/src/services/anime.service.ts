// services/anime.service.ts

import { Collection, ObjectId, type Db } from 'mongodb';

import { getDatabase } from '../database/mongo';
import type { Anime } from '../models/anime.model';

export class AnimeService {
	private get collection(): Collection<Anime> {
		return getDatabase().collection<Anime>('anime');
	}

	public async getAllAnime(): Promise<Anime[]> {
		return this.collection.find().toArray();
	}

	public async getAnimeById(id: string): Promise<Anime | null> {
		if (!ObjectId.isValid(id)) {
			return null;
		}

		return this.collection.findOne({
			_id: new ObjectId(id),
		});
	}

	public async createAnime(anime: Anime): Promise<Anime> {
		const result = await this.collection.insertOne(anime);
		return { ...anime, _id: result.insertedId };
	}

	public async updateAnime(id: string, anime: Anime): Promise<Anime | null> {
		if (!ObjectId.isValid(id)) {
			return null;
		}

		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: anime },
		);

		return result.modifiedCount > 0
			? { ...anime, _id: new ObjectId(id) }
			: null;
	}

	public async deleteAnime(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) {
			return false;
		}

		const result = await this.collection.deleteOne({
			_id: new ObjectId(id),
		});

		return result.deletedCount > 0;
	}

	public async searchAnimeByTitle(title: string): Promise<Anime[]> {
		return this.collection
			.find({
				$text: { $search: title },
			})
			.limit(10)
			.toArray();
	}
}

export const animeService = new AnimeService();
