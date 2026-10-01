// utils/image.ts

import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const UPLOAD_DIRECTORY = path.resolve('uploads/anime');

export async function saveAnimeImage(
	file: Express.Multer.File,
): Promise<string> {
	const filename = `${crypto.randomUUID()}-${Date.now()}.webp`;
	const filepath = path.join(UPLOAD_DIRECTORY, filename);

	await sharp(file.buffer)
		.resize({
			width: 600,
			height: 900,
			fit: 'cover',
			withoutEnlargement: true,
		})
		.webp({
			quality: 85,
		})
		.toFile(filepath);

	return `/uploads/anime/${filename}`;
}

export async function deleteAnimeImage(imageUrl: string): Promise<void> {
	const filename = path.basename(imageUrl);
	const filepath = path.join(UPLOAD_DIRECTORY, filename);

	try {
		await fs.unlink(filepath);
	} catch (error) {
		if (
			error instanceof Error &&
			'code' in error &&
			error.code === 'ENOENT'
		) {
			return;
		}

		throw error;
	}
}
