// database/seed.ts

import 'dotenv/config';

import { ObjectId } from 'mongodb';

import { connectDatabase, getDatabase } from './mongo';

async function seed(): Promise<void> {
	await connectDatabase();

	const db = getDatabase();

	const animeCollection = db.collection('anime');
	const genreCollection = db.collection('genres');

	console.log('Seeding database...');

	// Clear previous seed data
	await animeCollection.deleteMany({});
	await genreCollection.deleteMany({});

	// Genres
	const genres = {
		action: new ObjectId(),
		adventure: new ObjectId(),
		comedy: new ObjectId(),
		drama: new ObjectId(),
		fantasy: new ObjectId(),
		romance: new ObjectId(),
		mystery: new ObjectId(),
		psychological: new ObjectId(),
	};

	await genreCollection.insertMany([
		{
			_id: genres.action,
			name: 'Action',
			description:
				'Anime focused on combat, physical conflict and intense sequences.',
			slug: 'action',
		},
		{
			_id: genres.adventure,
			name: 'Adventure',
			description:
				'Anime centered around journeys, exploration and discovery.',
			slug: 'adventure',
		},
		{
			_id: genres.comedy,
			name: 'Comedy',
			description: 'Anime primarily intended to entertain through humor.',
			slug: 'comedy',
		},
		{
			_id: genres.drama,
			name: 'Drama',
			description:
				'Anime focused on emotional conflicts and character development.',
			slug: 'drama',
		},
		{
			_id: genres.fantasy,
			name: 'Fantasy',
			description:
				'Anime featuring supernatural worlds, magic or fantastical elements.',
			slug: 'fantasy',
		},
		{
			_id: genres.romance,
			name: 'Romance',
			description:
				'Anime focused on romantic relationships between characters.',
			slug: 'romance',
		},
		{
			_id: genres.mystery,
			name: 'Mystery',
			description:
				'Anime centered around mysteries, investigation and uncovering hidden truths.',
			slug: 'mystery',
		},
		{
			_id: genres.psychological,
			name: 'Psychological',
			description:
				'Anime focused on psychological conflict, manipulation and complex mental themes.',
			slug: 'psychological',
		},
	]);

	// Anime
	await animeCollection.insertMany([
		{
			title: 'Sousou no Frieren',
			english_title: "Frieren: Beyond Journey's End",
			description:
				'An elven mage begins a new journey after the death of her former companions.',
			episodes: 28,
			format: 'TV',
			release_year: 2023,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.adventure, genres.drama, genres.fantasy],
		},
		{
			title: 'Kaguya-sama wa Kokurasetai',
			english_title: 'Kaguya-sama: Love Is War',
			description:
				'Two student council members compete to make the other confess their feelings first.',
			episodes: 12,
			format: 'TV',
			release_year: 2019,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.comedy, genres.romance],
		},
		{
			title: 'Vinland Saga',
			english_title: 'Vinland Saga',
			description:
				'A young warrior pursues revenge while becoming entangled in war and political conflict.',
			episodes: 24,
			format: 'TV',
			release_year: 2019,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.action, genres.adventure, genres.drama],
		},
		{
			title: 'Dungeon Meshi',
			english_title: 'Delicious in Dungeon',
			description:
				'Adventurers explore a dungeon while surviving by cooking the monsters they encounter.',
			episodes: 24,
			format: 'TV',
			release_year: 2024,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.adventure, genres.comedy, genres.fantasy],
		},
		{
			title: 'Cyberpunk: Edgerunners',
			english_title: 'Cyberpunk: Edgerunners',
			description:
				'A street kid attempts to survive in a dangerous technologically enhanced city.',
			episodes: 10,
			format: 'ONA',
			release_year: 2022,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.action, genres.drama],
		},
		{
			title: 'Death Note',
			english_title: 'Death Note',
			description:
				'A student discovers a supernatural notebook that allows him to kill anyone whose name he writes in it.',
			episodes: 37,
			format: 'TV',
			release_year: 2006,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.mystery, genres.psychological],
		},
		{
			title: 'Monster',
			english_title: 'Monster',
			description:
				'A surgeon becomes entangled in a pursuit of a former patient whose life he once saved.',
			episodes: 74,
			format: 'TV',
			release_year: 2004,
			status: 'FINISHED',
			image_url: '',
			backdrop_url: '',
			genre_ids: [genres.drama, genres.mystery, genres.psychological],
		},
	]);

	// Required text index
	await animeCollection.createIndex({
		title: 'text',
		english_title: 'text',
	});

	console.log('Database seeded successfully.');
	process.exit(0);
}

seed().catch((error) => {
	console.error('Failed to seed database:', error);
	process.exit(1);
});
