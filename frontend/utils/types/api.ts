export interface BudgetResource {
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

export interface BudgetsResponse {
	data: BudgetResource[];
	links: {
		first: string;
		last: string;
		prev: string;
		next: string;
	};
	meta: {
		total: number;
		offset: number;
		limit: number;
	};
};

export interface UserResource {
	type: 'users';
	id: string;
	attributes: {
		first_name: string;
		last_name: string;
		email: string;
		id: string;
	};
};

export interface BillResource {
	type: 'bills';
	id: string;
	attributes: {
		name: string;
		amount: number;
		frequency: string | null;
		next_run: Date;
	};
};

export interface BillsResponse {
	data: BillResource[];
	links: {
		first: string;
		last: string;
		prev: string;
		next: string;
	};
	meta: {
		total: number;
		offset: number;
		limit: number;
	};
};

export interface PotResource {
	type: 'pots';
	id: string;
	attributes: {
		name: string;
		theme: string;
		target: number;
		amount: number;
		total_saved: number;
	};
};

export interface PotsResponse {
	data: PotResource[];
	links: {
		first: string;
		last: string;
		prev: string;
		next: string;
	};
	meta: {
		total: number;
		offset: number;
		limit: number;
	};
};

export interface TransactionResource {
	type: 'transactions';
	id: string;
	attributes: {
		amount: number;
		category: string;
		sender: string;
		sender_picture: string | null;
		date: Date;
	};
};

export interface TransactionsResponse {
	data: TransactionResource[];
	links: {
		first: string;
		last: string;
		prev: string;
		next: string;
	};
	meta: {
		total: number;
		offset: number;
		limit: number;
	};
};
