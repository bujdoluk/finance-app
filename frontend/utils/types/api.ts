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

export interface User {
	type: 'users';
	id: string;
	attributes: {
		first_name: string;
		last_name: string;
		email: string;
		id: string;
	};
}

export interface Bill {
	type: 'bills';
	id: string;
	attributes: {
		name: string;
		amount: number;
		frequency: string | null;
		next_run: Date;
	};
}

export interface Pot {
	type: 'pots';
	id: string;
	attributes: {
		name: string;
		theme: string;
		target: number;
		amount: number;
		total_saved: number;
	};
}

export interface Transaction {
	type: 'transactions';
	id: string;
	attributes: {
		amount: number;
		category: string;
		sender: string;
		sender_picture: string | null;
		date: Date;
	};
}
