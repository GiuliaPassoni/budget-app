import {
  doc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { toast } from 'solid-toast';
import { currentUser, db } from '~/firebase';

interface TransactionI {
  id?: string;
  amount: number;
  currency: string;
  exchange_to_default: number;
  notes: string;
  date: any;
  // date: typeof Date;
  ctg_name: string;
}

// TODO add date to type and methods

export async function addExpense(expense: TransactionI) {
  try {
    const docRef = await addDoc(
      collection(db, 'users', currentUser(), `expenses`),
      {
        ...expense,
        user_id: currentUser(),
      },
    );
    toast.success('Expense logged');
    console.debug('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding expense: ', e);
    toast.error('Error adding expense');
  }
}

export async function addIncome(income: TransactionI) {
  try {
    const docRef = await addDoc(
      collection(db, 'users', currentUser(), `income`),
      {
        ...income,
        user_id: currentUser(),
      },
    );
    toast.success('Income logged');
    console.debug('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding income: ', e);
    toast.error('Error adding income');
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
    const updatedRef = doc(db, 'expenses', expenseId);
    const docRef = await updateDoc(updatedRef, {
      [key]: updatedValue,
    });
    toast.success('Expense updated');
  } catch (e) {
    console.error('Error updating expense: ', e);
    toast.error('Error updating expense');
  }
}

export async function getExpenses(db: any) {
  let allExpenses: any[] = [];
  const querySnapshot = await getDocs(collection(db, 'expenses'));
  querySnapshot.forEach((doc) => {
    const m = { ...doc.data() };
    allExpenses.push(`${doc.id} => ${m}`);
  });
  return allExpenses;
}
