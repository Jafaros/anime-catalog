// errors/app.error.ts

export class AppError extends Error {
	public constructor(
		public readonly status: number,
		message: string,
	) {
		super(message);
	}
}
