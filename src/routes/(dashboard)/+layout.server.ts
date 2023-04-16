export const load = ({ cookies }) => {
	if (cookies.get('token')) {
		return { loggedIn: true };
	}

	return { loggedIn: false };
};
