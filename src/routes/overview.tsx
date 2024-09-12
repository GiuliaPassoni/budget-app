import { Title } from '@solidjs/meta';
import ChartCard from '~/components/molecules/ChartCard';
import PieChart from '~/components/atoms/PieChart';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import Table from '~/components/molecules/Table';
import { getExpenses, TransactionI } from '~/helpers/expenses_api_helpers';
import { Toaster } from 'solid-toast';
import { onSnapshot } from 'firebase/firestore';
import { currentUser, db } from '~/firebase';
import { collection } from 'firebase/firestore';
import Button from '~/components/atoms/Button';
import PlusIconButton from '~/components/atoms/PlusIconButton';
import AddTransactionModal from '~/components/molecules/AddTransactionModal';

export default function Overview() {
  const [showModal, setShowModal] = createSignal(false);
  const [showFullPageModal, setShowFullPageModal] = createSignal(true);

  const [transactions, setTransactions] = createSignal<
    TransactionI[] | undefined
  >([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  // Function to handle real-time updates
  function listenForExpenses() {
    const userId = currentUser(); // Get the current user ID

    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const expensesCollection = collection(db, 'users', userId, `expenses`);

    const unsubscribe = onSnapshot(
      expensesCollection,
      (snapshot) => {
        const expensesList = snapshot.docs.map((doc) => {
          const data = doc.data() as TransactionI; // Explicitly cast to TransactionI
          return {
            ...data,
            id: doc.id,
          };
        });
        setTransactions(expensesList);
        setLoading(false);
      },
      (err) => {
        setError('Failed to load expenses');
        console.error(err);
        setLoading(false);
      },
    );

    // Cleanup listener on component unmount
    onCleanup(() => unsubscribe());
  }

  createEffect(() => {
    listenForExpenses(); // Set up real-time listener
  });

  return (
    <main>
      <Title>Overview</Title>
      <h1>Account Overview</h1>
      <section class="max-w-6xl mx-auto">
        <PlusIconButton
          type="button"
          title="Record transaction"
          handleClick={() => {
            setShowModal(true);
          }}
        />
        <section></section>
        {loading() && <p>Loading...</p>}
        {/*{error() && <p>Error: {error()}</p>}*/}
        {!loading() && !error() && <Table array={transactions()} />}
        <AddTransactionModal
          showModal={showModal()}
          handleClose={() => setShowModal(false)}
          onSubmit={() => setShowModal(false)}
        />
        <div class="grid grid-cols-3 md:grid-cols-3 gap-4">
          <ChartCard title="Pie Chart">
            <img
              alt="dummy"
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/colorful-budget-allocation-pie-chart-template-design-214cd8acd8ebc2ffd3fcc47a10a38c5a_screen.jpg?ts=1696842185"
            />
            <PieChart w={50} h={50} r={50} />
            <Button text="Toggle Pie Chart" />
          </ChartCard>
          <ChartCard title="Bar Chart">
            <img
              alt="dummy"
              src="https://community.qlik.com/legacyfs/online/101366_Capture.JPG"
            />
            <PieChart w={50} h={50} r={50} />
          </ChartCard>
          <ChartCard title="Investing">
            <img
              alt="dummy"
              src="data:image/png;base64,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"
            />
            <PieChart w={50} h={50} r={50} />
          </ChartCard>
        </div>
      </section>
      <Toaster />
    </main>
  );
}
