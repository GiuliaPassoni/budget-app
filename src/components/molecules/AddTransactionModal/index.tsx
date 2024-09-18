import { createEffect, createSignal, For, onCleanup, Show } from 'solid-js';
import CloseModalIconButton from '~/components/atoms/CloseModalIconButton';
import * as categories from './../../../assets/mockCategories.json';
import StarIcon from '~/components/atoms/icons/StarIcon';
import { toast, Toaster } from 'solid-toast';
import { addNewTransaction } from '~/helpers/expenses_api_helpers';
import allCurrencies from '~/helpers/mock_values_helpers';
import PlusIconButton from '~/components/atoms/PlusIconButton';
import CardWithIcon from '~/components/molecules/CardWithIcon';
import TabButton from '~/components/atoms/TabButton';
import { CategoryI, TransactionType } from '~/helpers/types';
import { getCategories } from '~/helpers/categories_api_helpers';
import { currentUser, db } from '~/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import AddCategoryModal from '~/components/molecules/AddCategoryModal';

interface ModalProps {
  showModal: boolean;
  handleClose: () => void;
  onSubmit: () => void;
}

export default function AddTransactionModal(props: ModalProps) {
  const [method, setMethod] = createSignal<TransactionType>('expenses');
  const [amount, setAmount] = createSignal(0);
  const [currency, setCurrency] = createSignal('EUR');
  const [exchange, setExchange] = createSignal(1);
  const [category, setCategory] = createSignal('');
  const [note, setNote] = createSignal('');

  const [showCategModal, setShowCategModal] = createSignal<boolean>(false);
  function handleTabClick(prop: TransactionType) {
    setMethod(prop);
    test();
  }

  async function test() {
    return await getCategories();
  }

  async function handleSubmit() {
    // TODO refactor the below to be all props of one single signal-object
    if (amount() && currency() && exchange() && category()) {
      const transaction = {
        amount: amount(),
        currency: currency(),
        exchange_to_default: exchange(),
        notes: note(),
        date: new Date(),
        ctg_name: category(),
      };
      if (!method) {
        toast.error('Please specify transaction type');
      } else {
        await addNewTransaction({ transactionType: method(), transaction });
      }
    } else {
      toast.error('Missing input');
    }
  }

  const [categories, setCategories] = createSignal<CategoryI[] | undefined>([]);
  // todo use errors and loading states
  // todo write cleaner code instead of copy-pasting solution from overview page
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal('');

  // Function to handle real-time updates
  function listenForCategoryUpdates() {
    const userId = currentUser(); // Get the current user ID

    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const categoriesCollection = collection(db, 'users', userId, 'categories');

    const unsubscribe = onSnapshot(
      categoriesCollection,
      (snapshot) => {
        const categoriesList = snapshot.docs.map((doc) => {
          const data = doc.data() as CategoryI; // Explicitly cast to TransactionI
          return {
            ...data,
            id: doc.id,
          };
        });
        setCategories(categoriesList);
        setLoading(false);
      },
      (err) => {
        setError('Failed to load categories');
        console.error(err);
        setLoading(false);
      },
    );

    // Cleanup listener on component unmount
    onCleanup(() => unsubscribe());
  }

  createEffect(() => {
    listenForCategoryUpdates(); // Set up real-time listener
  });

  // TODO add datepicker to transaction and modal

  return (
    <Show when={props.showModal}>
      <div id="default-styled-tab-content">
        <div
          // aria-hidden={props.showModal}
          class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div class="relative p-4 w-full h-full max-w-md max-h-full m-auto">
            {/*Modal content*/}
            <div class="m-auto relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/*Modal header*/}
              <div class="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Transaction
                </h3>
                <CloseModalIconButton handleClick={props.handleClose} />
              </div>
              <div class="">
                <ul
                  class="w-full flex flex-wrap -mb-px text-sm font-medium text-center"
                  id="default-styled-tab"
                  data-tabs-toggle="#default-styled-tab-content"
                  data-tabs-active-classes="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500"
                  data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"
                  role="tablist"
                >
                  <li class="w-1/3" role="presentation">
                    <TabButton
                      label="Expense"
                      handleClick={() => handleTabClick('expenses')}
                    />
                  </li>
                  <li class="w-1/3" role="presentation">
                    <TabButton
                      label="Income"
                      handleClick={() => handleTabClick('income')}
                    />
                  </li>
                  <li class="w-1/3" role="presentation">
                    <TabButton
                      label="Investment"
                      handleClick={() => handleTabClick('investments')}
                    />
                  </li>
                </ul>
              </div>
              {/*Modal body*/}
              <div id="default-styled-tab-content">
                <form class="p-4 md:p-5">
                  <div class="grid gap-4 mb-4 grid-cols-2">
                    <div class="col-span-4 sm:col-span-1 mx-3 p-2">
                      <label
                        for="price"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Amount
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        class="bg-transparent border-none text-right text-gray-500 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="0,00"
                        required={true}
                        onBlur={(e) => {
                          e.preventDefault();
                          setAmount(Number(e.target.value));
                        }}
                      />
                    </div>
                    <div class="col-span-4 sm:col-span-1 mx-3 p-2">
                      <label
                        for="category"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Currency
                      </label>
                      <select
                        onChange={(e) => {
                          setCurrency(e.target.value);
                        }}
                        required={true}
                        id="category"
                        class="bg-transparent border-none text-left text-gray-500 text-sm focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      >
                        <For each={allCurrencies}>
                          {(i) => (
                            <option value={i.currency_code}>
                              {i.currency_code} ({i.country})
                            </option>
                          )}
                        </For>
                      </select>
                    </div>
                    <div class="col-span-2">
                      <label
                        for="category"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Category
                      </label>
                      <div class="grid grid-cols-3 md:grid-cols-3 gap-0">
                        <For each={categories()}>
                          {(i) => (
                            <CardWithIcon
                              title={i.name}
                              icon={<StarIcon />}
                              handleClick={() => {
                                setCategory(i.name);
                              }}
                            />
                          )}
                        </For>
                        <div class="col-span-12 my-2">
                          {/*todo connect category modal, or handle the flow otherwise*/}
                          <PlusIconButton
                            variant="secondary"
                            type="submit"
                            handleClick={() => {
                              showCategModal();
                            }}
                            title="Add category"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-span-2">
                      <label
                        for="description"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Transaction Notes
                      </label>
                      <textarea
                        id="description"
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder=""
                        value={note()}
                        onBlur={(e) => setNote(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  {/*tooltip doesn't work, may be hiding behind modal*/}
                  <PlusIconButton
                    type="submit"
                    variant="primary"
                    handleClick={async (e: Event) => {
                      e.preventDefault();
                      await handleSubmit();
                      props.handleClose();
                    }}
                    title="Add new transaction"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCategoryModal
        showModal={showCategModal()}
        handleClose={() => setShowCategModal(false)}
        onSubmit={() => setShowCategModal(false)}
      />
      <Toaster />
    </Show>
  );
}
