<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { Trash, X } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	import { AnimeApi } from '#lib/api/anime.api.ts';
	import type { Anime } from '#lib/models/anime.ts';

	let {
		open,
		onclose,
		anime
	}: {
		open: boolean;
		onclose: () => void;
		anime: Anime;
	} = $props();

	let deleting = $state(false);

	async function deleteAnime() {
		deleting = true;

		try {
			await AnimeApi.delete(anime._id);
			await goto('/');
		} finally {
			deleting = false;
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
		role="presentation"
		transition:fade={{ duration: 200 }}
		onclick={onclose}
	>
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="relative w-full max-w-md rounded-2xl border border-border
				bg-surface p-6 shadow-2xl"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="delete-anime-modal-title"
			aria-describedby="delete-anime-modal-description"
			onclick={(event) => event.stopPropagation()}
			in:fly={{ y: 16, duration: 250 }}
		>
			<button
				class="absolute top-4 right-4 rounded-lg p-1 text-muted
					transition-colors hover:bg-card hover:text-foreground"
				onclick={onclose}
				aria-label="Close"
			>
				<X size={20} />
			</button>

			<div
				class="mb-4 flex size-11 items-center justify-center rounded-xl
					bg-danger/10 text-danger"
			>
				<Trash size={20} />
			</div>

			<h2 id="delete-anime-modal-title" class="text-lg font-semibold text-foreground">
				Delete anime?
			</h2>

			<p id="delete-anime-modal-description" class="mt-2 text-sm leading-6 text-muted">
				Are you sure you want to delete
				<span class="font-medium text-foreground">{anime.title}</span>? This action cannot be
				undone.
			</p>

			<div class="mt-6 flex justify-end gap-3">
				<button
					type="button"
					class="rounded-lg border border-border bg-card px-4 py-2
						text-sm font-medium text-foreground transition-colors
						hover:bg-card-hover"
					onclick={onclose}
					disabled={deleting}
				>
					Cancel
				</button>

				<button
					type="button"
					class="flex items-center gap-2 rounded-lg bg-danger px-4 py-2
						text-sm font-semibold text-white transition-opacity
						hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					onclick={deleteAnime}
					disabled={deleting}
				>
					<Trash size={16} />

					{deleting ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	</div>
{/if}
