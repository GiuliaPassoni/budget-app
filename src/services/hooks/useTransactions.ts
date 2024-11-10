import { createMutation } from "@tanstack/solid-query";
import {
	addNewTransaction,
	TransactionPropsI,
} from "~/helpers/expenses_api_helpers";

export const useAddTransactionsMutation = ({
	transactionType,
	transaction,
}: TransactionPropsI) => {
	return createMutation(() => ({
		mutationKey: ["add-transaction", transactionType, transaction],
		mutationFn: () =>
			addNewTransaction({
				transactionType,
				transaction,
			}),
	}));
};
