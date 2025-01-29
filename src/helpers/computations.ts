import { DocumentData } from "firebase/firestore";

const calculateTransactionTotal = (transactions: DocumentData[]) => {
	return transactions.reduce((total, transaction) => {
		return total + transaction.amount * transaction.exchange_to_default;
	}, 0);
};

export { calculateTransactionTotal };
