// config/env.ts

import dotenv from 'dotenv';

dotenv.config();

export const env = {
	port: Number(process.env.PORT ?? 3000),
	mongodbUri: process.env.MONGODB_URI!,
	mongodbDatabase: process.env.MONGODB_DATABASE!,
};
