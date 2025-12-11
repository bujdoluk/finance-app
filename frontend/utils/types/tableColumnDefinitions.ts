// Nuxt table columns only work with flat object structure
export interface TransactionColumnDefinition {
	id: string;
	amount: number;
	category: string;
	sender: string;
	sender_picture: string | null;
	date: Date;
}
