import { ObjectId } from 'mongodb';
import { z } from 'zod';

export const animeSchema = z.object({
	title: z.string().trim().min(1),
	english_title: z.string().trim().optional(),
	description: z.string().trim().min(1),

	episodes: z.coerce.number().int().positive(),

	format: z.enum(['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL']),

	release_year: z.coerce
		.number()
		.int()
		.min(1900)
		.max(new Date().getFullYear() + 5),

	status: z.enum(['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED']),

	genre_ids: z.string().transform((value, ctx) => {
		try {
			const ids: unknown = JSON.parse(value);

			if (!Array.isArray(ids)) {
				throw new Error();
			}

			if (
				!ids.every(
					(id) => typeof id === 'string' && ObjectId.isValid(id),
				)
			) {
				throw new Error();
			}

			return ids.map((id) => new ObjectId(id));
		} catch {
			ctx.addIssue({
				code: 'custom',
				message: 'Invalid genre IDs.',
			});

			return z.NEVER;
		}
	}),
});
