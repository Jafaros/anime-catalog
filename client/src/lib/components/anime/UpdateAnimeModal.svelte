<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { X } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	import AnimeForm from './AnimeForm.svelte';
	import { AnimeApi } from '#lib/api/anime.api.ts';
	import type { Anime, AnimeFormData } from '#lib/models/anime.ts';
	import type { Genre } from '#lib/models/genre.ts';

	let {
		open,
		onclose,
		anime,
		genres
	}: {
		open: boolean;
		onclose: () => void;
		anime: Anime;
		genres: Genre[];
	} = $props();

	async function updateAnime(form: AnimeFormData) {
		await AnimeApi.update(anime._id, form);
		await goto('/');
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs md:p-6"
		role="presentation"
		transition:fade={{ duration: 200 }}
		onclick={onclose}
	>
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden
				rounded-2xl border border-border bg-surface shadow-2xl
				md:max-h-[calc(100dvh-3rem)]"
			role="dialog"
			aria-modal="true"
			aria-labelledby="anime-update-modal-title"
			onclick={(event) => event.stopPropagation()}
			in:fly={{ y: 20, duration: 300 }}
		>
			<header class="relative shrink-0 border-b border-border px-6 py-5">
				<h2 id="anime-update-modal-title" class="text-xl font-semibold text-foreground">
					Update anime
				</h2>

				<p class="mt-1 text-sm text-muted">Update the details of this anime.</p>

				<button
					class="absolute top-5 right-5 rounded-lg p-1 text-muted
						transition-colors hover:bg-card hover:text-foreground"
					onclick={onclose}
					aria-label="Close"
				>
					<X size={20} />
				</button>
			</header>

			<div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
				<AnimeForm {anime} onsubmit={updateAnime} {genres} />
			</div>
		</div>
	</div>
{/if}
