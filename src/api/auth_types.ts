export interface UserI {
	uid: string;
	name: string;
	email: string;
	password: string;
	avatar?: string;
	selected_currency: string;
	totalExpenses?: number;
	totalIncome?: number;
	totalInvestments?: number;
}
