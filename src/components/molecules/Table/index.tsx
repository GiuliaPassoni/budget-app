import { TransactionI } from '~/helpers/expenses_api_helpers';
import { For } from 'solid-js';
import { format } from 'date-fns';

interface TableProps {
  array: TransactionI[] | undefined; // Define the expected prop type
}

export function formatDate(date: Date | string) {
  return format(typeof date === 'string' ? new Date(date) : date, 'dd-mm-yyyy');
}

function firestoreTimestampToDate(timestamp: {
  seconds: number;
  nanoseconds: number;
}): Date {
  return new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
}

export default function Table({ array }: TableProps) {
  return (
    <>
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <Header />
          <tbody>
            <For each={array}>
              {(transaction) => (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td class="px-6 py-4">{transaction.amount}</td>
                  <td class="px-6 py-4">{transaction.currency}</td>
                  <td class="px-6 py-4">
                    {formatDate(firestoreTimestampToDate(transaction.date))}
                  </td>
                  <td class="px-6 py-4">{transaction.ctg_name}</td>
                  <td class="px-6 py-4">{transaction.notes}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Header() {
  return (
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
          Transaction amount
        </th>
        <th scope="col" class="px-6 py-3">
          Currency
        </th>
        <th scope="col" class="px-6 py-3">
          Date
        </th>
        <th scope="col" class="px-6 py-3">
          Category
        </th>
        <th scope="col" class="px-6 py-3">
          Notes
        </th>
      </tr>
    </thead>
  );
}
