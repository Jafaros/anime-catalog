<script lang="ts">
	import { Search, X } from '@lucide/svelte';

	import { AnimeApi } from '#lib/api/anime.api.ts';
	import type { Anime } from '#lib/models/anime.ts';

	let query = $state('');
	let results = $state<Anime[]>([]);
	let searching = $state(false);

	$effect(() => {
		const searchQuery = query.trim();

		if (!searchQuery) {
			results = [];
			searching = false;
			return;
		}

		const controller = new AbortController();

		const timeout = setTimeout(async () => {
			searching = true;

			try {
				results = await AnimeApi.search(searchQuery, controller.signal);
			} catch (error) {
				if (!(error instanceof DOMException && error.name === 'AbortError')) {
					console.error(error);
				}
			} finally {
				if (!controller.signal.aborted) {
					searching = false;
				}
			}
		}, 300);

		return () => {
			clearTimeout(timeout);
			controller.abort();
		};
	});

	function clearSearch() {
		query = '';
		results = [];
	}
</script>

<div class="relative w-full">
	<div class="relative">
		<Search
			size={18}
			class="pointer-events-none absolute top-1/2 left-4
				-translate-y-1/2 text-muted"
		/>

		<input
			type="search"
			placeholder="Search anime..."
			autocomplete="off"
			bind:value={query}
			class="w-full rounded-xl border border-border bg-card py-3 pr-11 pl-11
				text-sm text-foreground transition-colors outline-none
				placeholder:text-subtle
				focus:border-primary/60"
		/>

		{#if query}
			<button
				type="button"
				class="absolute top-1/2 right-4 -translate-y-1/2
					text-muted transition-colors hover:text-foreground"
				onclick={clearSearch}
				aria-label="Clear search"
			>
				<X size={17} />
			</button>
		{/if}
	</div>

	{#if query.trim()}
		<div
			class="absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden
				rounded-xl border border-border bg-surface shadow-2xl"
		>
			{#if searching}
				<div class="px-4 py-6 text-center text-sm text-muted">Searching...</div>
			{:else if results.length === 0}
				<div class="px-4 py-6 text-center">
					<p class="text-sm font-medium text-foreground">No anime found</p>

					<p class="mt-1 text-xs text-muted">
						No titles match "{query.trim()}".
					</p>
				</div>
			{:else}
				<div class="max-h-96 overflow-y-auto p-2">
					{#each results as anime (anime._id)}
						<a
							href={`/anime/${anime._id}`}
							class="flex gap-3 rounded-lg p-2 transition-colors
								hover:bg-card-hover"
						>
							{#if anime.image_url}
								<img
									src={anime.image_url}
									alt=""
									class="aspect-2/3 w-12 shrink-0 rounded-md object-cover"
								/>
							{:else}
								<div class="aspect-2/3 w-12 shrink-0 rounded-md bg-card"></div>
							{/if}

							<div class="min-w-0 self-center">
								<p class="truncate text-sm font-semibold text-foreground">
									{anime.title}
								</p>

								{#if anime.english_title && anime.english_title !== anime.title}
									<p class="mt-0.5 truncate text-xs text-muted">
										{anime.english_title}
									</p>
								{/if}

								<div class="mt-1 flex items-center gap-1.5 text-xs text-subtle">
									<span>{anime.release_year}</span>
									<span>·</span>
									<span>{anime.format}</span>
									<span>·</span>
									<span>
										{anime.episodes}
										{anime.episodes === 1 ? 'episode' : 'episodes'}
									</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
