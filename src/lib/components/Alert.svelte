<script lang="ts">
	export let type: 'error' | 'success' | 'warning' | 'info';
</script>

<p class="alert alert-{type} {$$props.class}">
	<slot />
</p>
