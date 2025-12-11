export type AuthUser = {
	message: string;
	token: string;
	user: {
		first_name: string;
		last_name: string;
		email: string;
		id: string;
	};
};
