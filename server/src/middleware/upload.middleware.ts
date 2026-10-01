// middleware/upload.middleware.ts

import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadAnimeImage = multer({
	storage,

	limits: {
		fileSize: 5 * 1024 * 1024,
	},

	fileFilter: (_req, file, callback) => {
		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

		if (!allowedMimeTypes.includes(file.mimetype)) {
			callback(new Error('Only JPEG, PNG and WebP images are allowed.'));
			return;
		}

		callback(null, true);
	},
}).single('image');
