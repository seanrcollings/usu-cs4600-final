<script lang="ts">
	import EditIcon from '../icons/EditIcon.svelte';

	export let tooltip = '';
	export let href: string | undefined = undefined;
	export let isButton = false;
</script>

<div class="tooltip" data-tip={tooltip}>
	{#if !isButton}
		<a class={`btn btn-circle ${$$props.class}`} {href}>
			<EditIcon />
		</a>
	{:else}
		<button class={`btn btn-circle ${$$props.class}`} on:click>
			<EditIcon />
		</button>
	{/if}
</div>
