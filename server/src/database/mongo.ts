// database/mongo.ts

import { Db, MongoClient } from 'mongodb';

import { env } from '../config/env.js';

const client = new MongoClient(env.mongodbUri);

let db: Db;

export async function connectDatabase(): Promise<void> {
	await client.connect();

	db = client.db(env.mongodbDatabase);
}

export function getDatabase(): Db {
	if (!db) {
		throw new Error('Database has not been initialized.');
	}

	return db;
}

export async function disconnectDatabase(): Promise<void> {
	await client.close();
}
