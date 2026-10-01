<script lang="ts">
	import DeleteAnimeModal from '#lib/components/anime/DeleteAnimeModal.svelte';
	import UpdateAnimeModal from '#lib/components/anime/UpdateAnimeModal.svelte';
	import { SquarePen, Trash } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';

	const { data } = $props();
	const anime = $derived(data.anime);
	const genres = $derived(data.genres);

	const animeGenres = $derived(() => {
		return genres.filter((genre) => anime.genre_ids.includes(genre._id));
	});

	let updateModalOpen = $state(false);
	let deleteModalOpen = $state(false);
</script>

<svelte:head>
	<title>{anime.title} - Anime Catalog</title>
	<meta name="description" content={anime.description} />
</svelte:head>

<header class="relative h-72 overflow-hidden md:h-128" in:fade={{ duration: 300 }}>
	{#if anime.backdrop_url}
		<img
			src={anime.backdrop_url}
			alt=""
			class="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-xs"
		/>
	{/if}

	<div class="absolute inset-0 bg-black/35"></div>

	<div
		class="absolute inset-0 bg-linear-to-b from-transparent via-background/30 to-background"
	></div>

	<div
		class="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/40"
	></div>
</header>

<main class="relative container -mt-36 max-w-7xl pb-16" in:fly={{ y: 20, duration: 300 }}>
	<div class="flex items-end gap-8">
		<img
			src={anime.image_url}
			alt={anime.title}
			class="hidden aspect-2/3 w-52 rounded-xl object-cover shadow-2xl md:block"
		/>

		<div class="pb-2">
			<p class="mb-2 text-sm font-medium text-primary">
				{anime.format} · {anime.release_year}
			</p>

			{#if animeGenres().length > 0}
				<div class="mb-4 flex flex-wrap items-center gap-3">
					{#each animeGenres() as genre (genre._id)}
						<span
							class="rounded-md border border-primary px-2 py-1 text-xs font-semibold text-primary"
							>{genre.name}</span
						>
					{/each}
				</div>
			{/if}

			<h1 class="text-4xl font-bold tracking-tight md:text-5xl">
				{anime.title}
			</h1>

			{#if anime.english_title && anime.english_title !== anime.title}
				<p class="mt-2 text-lg text-muted">
					{anime.english_title}
				</p>
			{/if}

			<p class="mt-4 text-sm text-muted">
				{anime.description}
			</p>
		</div>
	</div>
</main>

<button
	class="fixed bottom-4 left-4 inline-flex items-center gap-2 rounded-lg bg-danger p-4 font-medium text-foreground transition-opacity
						hover:opacity-90 max-md:text-sm"
	onclick={() => (deleteModalOpen = true)}
	><Trash size={16} strokeWidth={3} />
</button>

<button
	class="fixed right-4 bottom-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-foreground transition-colors hover:bg-primary-hover max-md:text-sm"
	onclick={() => (updateModalOpen = true)}
	><SquarePen size={16} strokeWidth={3} /> Update anime</button
>

<UpdateAnimeModal
	open={updateModalOpen}
	onclose={() => (updateModalOpen = false)}
	{anime}
	{genres}
/>

<DeleteAnimeModal open={deleteModalOpen} onclose={() => (deleteModalOpen = false)} {anime} />
