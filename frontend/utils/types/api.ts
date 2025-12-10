export interface Budget {
	attributes: {
		name: string;
		theme: string;
		amount: number;
		maximum_spending: number;
		created_at: Date;
	};
	id: number;
	type: 'budgets';
};

export type AuthUser = { message: string; token: string; user: { first_name: string; last_name: string; email: string } };

export interface User {
	type: 'users';
	id: string;
	attributes: {
		first_name: string;
		last_name: string;
		email: string;
	};
}
