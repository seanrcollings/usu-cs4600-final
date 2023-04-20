<script lang="ts">
	export let checked: boolean = false;

	export let id: string;
	export let name: string | undefined = undefined;
	export let disabled: boolean = false;
	export let readonly: boolean = false;

	export let label: string = '';
</script>

<div class={`flex items-center ${$$props.class}`}>
	<input
		type="checkbox"
		bind:checked
		{id}
		{name}
		{disabled}
		{readonly}
		{...$$restProps}
		class={`toggle mr-2 ${$$props.class}`}
	/>
	<label class="label" for={id}>
		{label}
	</label>
</div>
