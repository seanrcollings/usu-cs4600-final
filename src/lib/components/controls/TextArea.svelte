<script lang="ts">
	export let value: string | undefined = undefined;
	export let id: string;
	export let name: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let readonly: boolean = false;

	export let label: string = '';
</script>

<div class="form-control">
	<label class="label" for={id}>
		{label}
	</label>
	<textarea
		class="textarea textarea-bordered h-36"
		bind:value
		{id}
		{name}
		{placeholder}
		{required}
		{disabled}
		{readonly}
		{...$$restProps}
	/>
</div>
