<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import CreateAnimeModal from '#lib/components/anime/CreateAnimeModal.svelte';
	import { Plus } from '@lucide/svelte';

	let { data, children } = $props();
	const genres = $derived(data.genres);
	let createModalOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header
	class="flex items-center justify-between gap-4 border-b border-b-muted/25 px-8 py-4 text-foreground max-md:px-4"
>
	<h1 class="text-4xl font-semibold max-md:text-2xl"><a href="/">Anime Catalog</a></h1>

	<button
		class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-foreground transition-colors hover:bg-primary-hover max-md:text-sm"
		onclick={() => (createModalOpen = true)}><Plus size={16} strokeWidth={3} /> Add anime</button
	>

	<CreateAnimeModal open={createModalOpen} onclose={() => (createModalOpen = false)} {genres} />
</header>
<main>
	{@render children()}
</main>
