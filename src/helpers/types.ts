import { iconMap } from "~/components/atoms/icons/helpers";

export type TransactionType = "expenses" | "income" | "investments";

export interface CategoryI {
	name: string;
	colour: string;
	iconName?: keyof typeof iconMap;
	type: TransactionType;
}

export interface CategoryWithId extends CategoryI {
	id: string;
}
