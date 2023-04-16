<script>
	import { enhance } from '$app/forms';
</script>

<form action="/logout" method="POST" use:enhance>
	<slot>
		<button tabindex="-1">Logout</button>
	</slot>
</form>
