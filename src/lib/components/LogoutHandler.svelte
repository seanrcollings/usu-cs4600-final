<script>
	import { enhance } from '$app/forms';
</script>

<form action="/logout" method="POST" use:enhance>
	<slot>
		<button tabindex="-1" class={`btn btn-ghost p-2 block ${$$props.class}`}>Log Out</button>
	</slot>
</form>
