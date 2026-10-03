<script lang="ts">
	import type { Anime, AnimeFormat, AnimeFormData, AnimeStatus } from '#lib/models/anime.ts';
	import type { Genre } from '#lib/models/genre.ts';
	import { ImageUp } from '@lucide/svelte';
	import { untrack } from 'svelte';

	let {
		anime,
		genres,
		onsubmit
	}: {
		anime?: Anime;
		genres: Genre[];
		onsubmit: (data: AnimeFormData) => Promise<void>;
	} = $props();

	let title = $state('');
	let englishTitle = $state('');
	let description = $state('');
	let episodes = $state(1);
	let format = $state<AnimeFormat>('TV');
	let releaseYear = $state(new Date().getFullYear());
	let status = $state<AnimeStatus>('FINISHED');
	let genreIds = $state<string[]>([]);
	let image = $state<File>();

	$effect(() => {
		const currentAnime = anime;

		untrack(() => {
			title = currentAnime?.title ?? '';
			englishTitle = currentAnime?.english_title ?? '';
			description = currentAnime?.description ?? '';
			episodes = currentAnime?.episodes ?? 1;
			format = currentAnime?.format ?? 'TV';
			releaseYear = currentAnime?.release_year ?? new Date().getFullYear();
			status = currentAnime?.status ?? 'FINISHED';
			genreIds = currentAnime?.genre_ids ? [...currentAnime.genre_ids] : [];
		});
	});

	let submitting = $state(false);

	function toggleGenre(id: string) {
		genreIds = genreIds.includes(id)
			? genreIds.filter((genreId) => genreId !== id)
			: [...genreIds, id];
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		submitting = true;

		try {
			await onsubmit({
				title,
				english_title: englishTitle,
				description,
				episodes,
				format,
				release_year: releaseYear,
				status,
				genre_ids: genreIds,
				image
			});
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={submit} class="space-y-5">
	<div>
		<label for="title" class="mb-2 block text-sm font-medium"> Title </label>

		<input
			id="title"
			bind:value={title}
			required
			class="w-full rounded-lg border border-border bg-card px-3 py-2
				transition outline-none focus:border-primary"
		/>
	</div>

	<div>
		<label for="english-title" class="mb-2 block text-sm font-medium"> English title </label>

		<input
			id="english-title"
			bind:value={englishTitle}
			class="w-full rounded-lg border border-border bg-card px-3 py-2
				transition outline-none focus:border-primary"
		/>
	</div>

	<div>
		<label for="description" class="mb-2 block text-sm font-medium"> Description </label>

		<textarea
			id="description"
			bind:value={description}
			required
			rows="5"
			class="w-full resize-none rounded-lg border border-border bg-card
				px-3 py-2 transition outline-none focus:border-primary"></textarea>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="episodes" class="mb-2 block text-sm font-medium"> Episodes </label>

			<input
				id="episodes"
				type="number"
				min="1"
				bind:value={episodes}
				required
				class="w-full rounded-lg border border-border bg-card px-3 py-2"
			/>
		</div>

		<div>
			<label for="year" class="mb-2 block text-sm font-medium"> Release year </label>

			<input
				id="year"
				type="number"
				bind:value={releaseYear}
				required
				class="w-full rounded-lg border border-border bg-card px-3 py-2"
			/>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<select bind:value={format} class="rounded-lg border border-border bg-card px-3 py-2">
			<option value="TV">TV</option>
			<option value="MOVIE">Movie</option>
			<option value="OVA">OVA</option>
			<option value="ONA">ONA</option>
			<option value="SPECIAL">Special</option>
		</select>

		<select bind:value={status} class="rounded-lg border border-border bg-card px-3 py-2">
			<option value="FINISHED">Finished</option>
			<option value="RELEASING">Releasing</option>
			<option value="NOT_YET_RELEASED">Not yet released</option>
			<option value="CANCELLED">Cancelled</option>
		</select>
	</div>

	<div>
		<label for="genre" id="genre" class="mb-2 block text-sm font-medium text-foreground">
			Genres
		</label>

		<div class="flex flex-wrap gap-2">
			{#each genres as genre (genre._id)}
				<button
					type="button"
					onclick={() => toggleGenre(genre._id)}
					class={[
						'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
						genreIds.includes(genre._id)
							? 'border-primary bg-primary/15 text-primary'
							: 'border-border bg-card text-muted hover:border-primary/40 hover:text-foreground'
					]}
				>
					{genre.name}
				</button>
			{/each}
		</div>

		{#if genreIds.length === 0}
			<p class="mt-2 text-xs text-subtle">Select at least one genre.</p>
		{/if}
	</div>

	<div>
		<label for="image" class="mb-2 block text-sm font-medium text-foreground"> Poster </label>

		<label
			for="image"
			class="group flex cursor-pointer items-center gap-4 rounded-xl border
			border-dashed border-border bg-card px-4 py-4
			transition-colors
			hover:border-primary/60 hover:bg-card-hover"
		>
			<div
				class="flex size-11 shrink-0 items-center justify-center rounded-lg
				bg-primary/10 text-primary transition-colors
				group-hover:bg-primary/15"
			>
				<ImageUp size={20} />
			</div>

			<div class="min-w-0 flex-1">
				{#if image}
					<p class="truncate text-sm font-medium text-foreground">
						{image.name}
					</p>

					<p class="mt-0.5 text-xs text-muted">
						{(image.size / 1024 / 1024).toFixed(2)} MB
					</p>
				{:else}
					<p class="text-sm font-medium text-foreground">Choose a poster</p>

					<p class="mt-0.5 text-xs text-muted">JPEG, PNG or WebP · Max 5 MB</p>
				{/if}
			</div>

			<span
				class="rounded-lg border border-border bg-surface px-3 py-1.5
				text-xs font-medium text-muted transition-colors
				group-hover:text-foreground"
			>
				Browse
			</span>
		</label>

		<input
			id="image"
			type="file"
			accept="image/jpeg,image/png,image/webp"
			class="sr-only"
			onchange={(event) => {
				image = event.currentTarget.files?.[0];
			}}
		/>
	</div>

	<button
		type="submit"
		disabled={submitting}
		class="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white
			transition hover:bg-primary-hover disabled:opacity-50"
	>
		{submitting ? 'Saving...' : anime ? 'Save changes' : 'Add anime'}
	</button>
</form>
