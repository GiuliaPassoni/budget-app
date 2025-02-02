import {
	addDoc,
	collection,
	doc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { toast } from "solid-toast";
import { currentUser, db } from "~/firebase";
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
	tags?: string[];
	type?: TransactionType; //todo maybe remove, since the db name is already the type
}

export interface TransactionWithId extends TransactionI {
	id: string;
}

// TODO add date to type and methods
export interface TransactionPropsI {
	transactionType: TransactionType;
	transaction: TransactionI;
}

/* todo record lesson learnt:
 * sept 24. I thought initially that there should be a separate method set for expenses, income, and investments.
 * However, I've realised that the method would look the same for all 3 - it makes more sense to have one method, with associated types,
 * that can cover each with a specific prop,
 * */

export async function addNewTransaction(props: TransactionPropsI) {
	try {
		const res = await addDoc(
			collection(db, "users", currentUser(), props.transactionType),
			{
				...props.transaction,
				user_id: currentUser(),
			},
		);
		toast.success("Transaction logged");
		return res;
	} catch (e) {
		console.error("Error adding transaction: ", e);
		toast.error("Error adding transaction");
	}
}

export async function getExpenses() {
	try {
		let allExpenses: TransactionI[] = [];
		const querySnapshot = await getDocs(
			collection(db, "users", currentUser(), `expenses`),
		);
		querySnapshot.forEach((doc) => {
			const data = doc.data() as TransactionI; // Type assertion
			allExpenses.push(data);
		});
		return allExpenses;
	} catch (e) {
		console.error(
			"Error retrieving expenses: ",
			e instanceof Error ? e.message : e,
		);
	}
}

// TODO update all the below when implementation is needed
interface UpdateExpensePropsI {
	db: any;
	expenseId: string;
	key: string;
	updatedValue: any;
}

export async function updateExpense({
	expenseId,
	key,
	updatedValue,
}: UpdateExpensePropsI) {
	try {
		const updatedRef = doc(db, "expenses", expenseId);
		await updateDoc(updatedRef, {
			[key]: updatedValue,
		});
		toast.success("Expense updated");
	} catch (e) {
		console.error("Error updating expense: ", e);
		toast.error("Error updating expense");
	}
}
