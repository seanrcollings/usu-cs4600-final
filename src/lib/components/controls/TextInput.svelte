<script lang="ts">
	export let value: string | undefined = undefined;
	export let id: string;
	export let name: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let readonly: boolean = false;
	export let autocomplete: boolean = true;

	export let label: string = '';
</script>

<div class="form-control">
	<label class="label" for={id}>
		{label}
	</label>
	<slot name="before" />
	<input
		class="input input-bordered"
		bind:value
		{id}
		{name}
		{placeholder}
		{required}
		{disabled}
		{readonly}
		autocomplete={autocomplete.toString()}
		{...$$restProps}
	/>
	<slot name="after" />
</div>
