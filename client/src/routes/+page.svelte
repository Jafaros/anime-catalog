<script lang="ts">
	import AnimeSearch from '#lib/components/anime/AnimeSearch.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();
	const anime = $derived(data.anime);

	let loading = $state(true);
	onMount(() => {
		loading = false;
	});
</script>

<svelte:head>
	<title>Anime Catalog</title>
	<meta name="description" content="A catalog of anime titles." />
</svelte:head>

<div class="mx-auto w-full max-w-xl py-4">
	<AnimeSearch />
</div>

{#if loading}
	<p>Loading...</p>
{:else}
	<section class="container py-8">
		<div class="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each anime as item (item._id)}
				<a class="group min-w-0" href={`/anime/${item._id}`}>
					<div
						class="relative aspect-2/3 overflow-hidden rounded-xl border border-border bg-card
					transition-all duration-300
					group-hover:-translate-y-1
					group-hover:border-primary/50
					group-hover:shadow-xl
					group-hover:shadow-primary/10"
					>
						{#if item.image_url}
							<img
								src={item.image_url}
								alt={item.title}
								class="h-full w-full object-cover transition-transform duration-500
							group-hover:scale-105"
							/>
						{:else}
							<div class="flex h-full items-center justify-center text-sm text-muted">No image</div>
						{/if}

						<!-- Slight bottom shading -->
						<div
							class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3
						bg-linear-to-t from-black/50 to-transparent"
						></div>

						<!-- Format badge -->
						<span
							class="absolute top-3 right-3 rounded-md bg-black/65 px-2 py-1
						text-xs font-semibold text-white backdrop-blur-md"
						>
							{item.format}
						</span>
					</div>

					<div class="mt-3 px-1">
						<h2
							class="truncate font-semibold text-foreground transition-colors
						group-hover:text-primary"
						>
							{item.title}
						</h2>

						{#if item.english_title && item.english_title !== item.title}
							<p class="mt-0.5 truncate text-sm text-muted">
								{item.english_title}
							</p>
						{/if}

						<div class="mt-2 flex items-center gap-2 text-xs text-subtle">
							<span>{item.release_year}</span>

							<span class="size-1 rounded-full bg-subtle/60"></span>

							<span>
								{item.episodes}
								{item.episodes === 1 ? 'episode' : 'episodes'}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}
