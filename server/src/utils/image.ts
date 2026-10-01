// utils/image.ts

import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const UPLOAD_DIRECTORY = path.resolve('uploads/anime');

export interface AnimeImages {
	posterUrl: string;
	backdropUrl: string;
}

export async function saveAnimeImage(
	file: Express.Multer.File,
): Promise<AnimeImages> {
	await fs.mkdir(UPLOAD_DIRECTORY, { recursive: true });

	const id = crypto.randomUUID();

	const posterFilename = `${id}-poster.webp`;
	const backdropFilename = `${id}-backdrop.webp`;

	await Promise.all([
		sharp(file.buffer)
			.resize({
				width: 600,
				height: 900,
				fit: 'cover',
				withoutEnlargement: true,
			})
			.webp({ quality: 85 })
			.toFile(path.join(UPLOAD_DIRECTORY, posterFilename)),

		sharp(file.buffer)
			.resize({
				width: 1600,
				height: 600,
				fit: 'cover',
				withoutEnlargement: true,
			})
			.webp({ quality: 80 })
			.toFile(path.join(UPLOAD_DIRECTORY, backdropFilename)),
	]);

	return {
		posterUrl: `/uploads/anime/${posterFilename}`,
		backdropUrl: `/uploads/anime/${backdropFilename}`,
	};
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
