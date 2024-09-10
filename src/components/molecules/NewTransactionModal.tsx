import { createEffect, createSignal, For, Show } from 'solid-js';
import CloseModalIconButton from '~/components/atoms/CloseModalIconButton';
import * as currencies from './../../assets/currencies.json';
import * as categories from './../../assets/mockCategories.json';
import PlusIconButton from '~/components/baseComponents/PlusIconButton';
import CardWithIcon from '~/components/atoms/CardWithIcon';
import StarIcon from '~/components/atoms/icons/StarIcon';
import { toast, Toaster } from 'solid-toast';
import { addExpense } from '~/helpers/expenses_api_helpers';
import allCurrencies from '~/helpers/mock_values_helpers';

interface ModalProps {
  showModal: boolean;
  handleClose: () => void;
  onSubmit: () => void;
  // title?: string;
  // body: any;
  // footer: any;
}

type MethodType = 'expenses' | 'income';

export default function NewTransactionModal(props: ModalProps) {
  const [method, setMethod] = createSignal('expense');
  const [amount, setAmount] = createSignal(0);
  const [currency, setCurrency] = createSignal('EUR');
  const [exchange, setExchange] = createSignal(1);
  const [category, setCategory] = createSignal('');
  const [note, setNote] = createSignal('');
  // @ts-ignore
  const allCategories: any = categories['default'];

  function handleTabClick(prop: MethodType) {
    setMethod(prop);
  }

  async function handleSubmit() {
    if (amount() && currency() && exchange() && category()) {
      if (!method) {
        toast.error('Please specify transaction type');
      }
      if (method() === 'expenses') {
        await addExpense({
          amount: amount(),
          currency: currency(),
          exchange_to_default: exchange(),
          notes: note(),
          date: new Date(),
          ctg_name: category(),
        });
      } else if (method() === 'income') {
        console.debug('income!');
      }
    } else {
      toast.error('Missing input');
    }
  }

  // TODO add datepicker to transaction and modal

  return (
    <Show when={props.showModal}>
      <div id="default-styled-tab-content">
        {/*<div class="mb-4 border-b border-gray-200 dark:border-gray-700">*/}
        {/*  <ul*/}
        {/*    class="flex flex-wrap -mb-px text-sm font-medium text-center"*/}
        {/*    id="default-styled-tab"*/}
        {/*    data-tabs-toggle="#default-styled-tab-content"*/}
        {/*    data-tabs-active-classes="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500"*/}
        {/*    data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"*/}
        {/*    role="tablist"*/}
        {/*  >*/}
        {/*    <li class="me-2" role="presentation">*/}
        {/*      <button*/}
        {/*        class="inline-block p-4 border-b-2 rounded-t-lg"*/}
        {/*        id="expense-styled-tab"*/}
        {/*        data-tabs-target="#styled-expense"*/}
        {/*        type="button"*/}
        {/*        role="tab"*/}
        {/*        aria-controls="expense"*/}
        {/*        aria-selected="false"*/}
        {/*        onClick={() => handleTabClick('expenses')}*/}
        {/*      >*/}
        {/*        expense*/}
        {/*      </button>*/}
        {/*    </li>*/}
        {/*    <li class="me-2" role="presentation">*/}
        {/*      <button*/}
        {/*        class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"*/}
        {/*        id="income-styled-tab"*/}
        {/*        data-tabs-target="#styled-income"*/}
        {/*        type="button"*/}
        {/*        role="tab"*/}
        {/*        aria-controls="income"*/}
        {/*        aria-selected="false"*/}
        {/*        onClick={() => handleTabClick('income')}*/}
        {/*      >*/}
        {/*        income*/}
        {/*      </button>*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</div>*/}
        <div
          aria-hidden={props.showModal}
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
                  <li class="w-1/2" role="presentation">
                    <button
                      class="inline-block p-2 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      id="expense-styled-tab"
                      data-tabs-target="#styled-expense"
                      role="tab"
                      aria-controls="expense"
                      onClick={() => handleTabClick('expenses')}
                    >
                      Expense
                    </button>
                  </li>
                  <li class="w-1/2" role="presentation">
                    <button
                      class="inline-block p-2 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                      id="income-styled-tab"
                      data-tabs-target="#styled-income"
                      type="button"
                      role="tab"
                      aria-controls="income"
                      aria-selected="false"
                      onClick={() => handleTabClick('income')}
                    >
                      Income
                    </button>
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
                        onBlur={(e) => setAmount(Number(e.target.value))}
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
                        <For each={allCategories}>
                          {(i) => (
                            <CardWithIcon
                              title={i.name}
                              icon={<StarIcon />}
                              handleClick={() => {
                                setCategory(i.name);
                                console.debug(category());
                              }}
                            />
                          )}
                        </For>
                        <CardWithIcon
                          title="Add category"
                          icon={
                            <PlusIconButton
                              type="submit"
                              handleClick={props.onSubmit}
                              title="Add category"
                            />
                          }
                        />
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
                    handleClick={async (e: Event) => {
                      e.preventDefault();
                      await handleSubmit();
                    }}
                    title="Add new transaction"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </Show>
  );
}
