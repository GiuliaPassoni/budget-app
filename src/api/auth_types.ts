export interface UserI {
	uid: string;
	name: string;
	email: string;
	password: string;
	avatar?: string;
	selectedCurrency: string;
	totalExpenses?: number;
	totalIncome?: number;
	totalInvestments?: number;
}
