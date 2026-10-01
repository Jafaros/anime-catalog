// index.ts

import 'dotenv/config';

import app from './app';
import { connectDatabase } from './database/mongo';
import { env } from './config/env';

async function bootstrap() {
	try {
		await connectDatabase();

		app.listen(env.port, () => {
			console.log(`Server running on http://localhost:${env.port}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

bootstrap();
