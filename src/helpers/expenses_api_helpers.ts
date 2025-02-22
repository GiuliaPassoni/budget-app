import { TransactionType } from "~/helpers/types";

export interface TransactionI {
	id?: string;
	amount: number;
	currency: string;
	exchange_to_default: number;
	exchange_on_date?: string | Date;
	notes?: string;
	date: any;
	ctg_name: string;
	ctg_colour?: string;
	tags?: string[];
	type?: TransactionType; //todo maybe remove, since the db name is already the type
}

export interface TransactionWithId extends TransactionI {
	id: string;
}

/* todo record lesson learnt:
 * sept 24. I thought initially that there should be a separate method set for expenses, income, and investments.
 * However, I've realised that the method would look the same for all 3 - it makes more sense to have one method, with associated types,
 * that can cover each with a specific prop,
 * */
