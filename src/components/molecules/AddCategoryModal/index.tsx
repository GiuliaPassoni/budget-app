import { createSignal, For, Show } from 'solid-js';
import PlusIconButton from '~/components/atoms/PlusIconButton';
import { TransactionType } from '~/helpers/types';
import CloseModalIconButton from '~/components/atoms/CloseModalIconButton';
import { toast, Toaster } from 'solid-toast';
import { addNewCategory } from '~/helpers/categories_api_helpers';
import { pastelColors } from '~/helpers/colour_helpers';
import { iconMap } from '~/components/atoms/icons/helpers';

interface ModalProps {
  showModal: boolean;
  handleClose: () => void;
  onSubmit: () => void;
}
export default function AddCategoryModal(props: ModalProps) {
  const [name, setName] = createSignal('');
  const [type, setType] = createSignal<TransactionType>('expenses');
  const [iconName, setIconName] = createSignal('');
  const [selectedColour, setSelectedColour] = createSignal('');

  const types = ['expenses', 'income', 'investments'];

  const iconNames = ['star', 'moon', 'sun'];

  async function handleSubmit() {
    if (name() && selectedColour() && iconName() && type()) {
      const category = {
        name: name(),
        colour: selectedColour(),
        iconName: iconName(),
        type: type(),
      };
      return await addNewCategory({ category: category });
    } else {
      toast.error('Missing input');
    }
  }

  return (
    <Show when={props.showModal}>
      <div id="default-styled-tab-content">
        <div
          // aria-hidden={props.showModal}
          class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div class="relative p-4 max-w-md m-auto">
            {/*Modal content*/}
            <div class="m-auto relative bg-white rounded-lg shadow dark:bg-gray-700">
              {/*Modal header*/}
              <div class="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Category
                </h3>
                <CloseModalIconButton handleClick={props.handleClose} />
              </div>
              {/*Modal body*/}
              <div id="default-styled-tab-content">
                <form class="">
                  <div class="grid gap-4 my-2">
                    <div class="row-span-1 row-start-1">
                      <label
                        for="price"
                        class="block mb-2 font-medium text-gray-900 dark:text-white"
                      >
                        Category Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="category-name"
                        class="
                        text-sm
                        bg-gray-200 rounded mx-auto block p-2.5 text-gray-500
                        focus:ring-primary-500 focus:border-primary-500
                        dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Category Name"
                        required={true}
                        onBlur={(e) => {
                          e.preventDefault();
                          setName(e.target.value);
                        }}
                      />
                    </div>
                    <div class="row w-full mx-auto p-2">
                      <label
                        for="category"
                        class="block mb-2 font-medium text-gray-900 dark:text-white"
                      >
                        Transaction Type
                      </label>
                      <div class="grid grid-cols-3 mx-auto">
                        <For each={types}>
                          {(type) => (
                            <div class="">
                              <input
                                id="inline-radio"
                                type="radio"
                                value={type}
                                name="type-group"
                                onClick={() => setType(type as TransactionType)}
                                class="
                                  w-4 h-4
                                  text-blue-600 bg-gray-100 border-gray-300
                                  focus:ring-blue-500 focus:ring-2
                                  dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <label
                                for="inline-radio"
                                class="ms-2 text-sm text-gray-900 dark:text-gray-300"
                              >
                                {type}
                              </label>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                    <div class="row max-w-[512px] mx-3">
                      <label
                        for="category"
                        class="block mb-2 font-medium text-gray-900 dark:text-white"
                      >
                        Colour
                      </label>
                      <div class="flex">
                        <div class="grid grid-cols-12 gap-2 mx-auto w-full">
                          <For each={pastelColors}>
                            {(colour) => (
                              <div class="col-span-2">
                                <button
                                  id="inline-radio"
                                  class={`rounded-full w-8 h-8 col-end-1 ${colour.colourClass} border-2`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedColour(colour.name);
                                  }}
                                />
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                    <div class="row max-w-[512px] mx-3">
                      <label
                        for="category"
                        class="block mb-2 font-medium text-gray-900 dark:text-white"
                      >
                        Icon
                      </label>
                      <div class="flex">
                        <div class="grid grid-cols-12 gap-2 mx-auto w-full">
                          <For each={iconNames}>
                            {(icon) => (
                              <div class="col-span-4">
                                <button
                                  id="inline-radio"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setIconName(icon);
                                  }}
                                >
                                  {icon ? iconMap[icon]?.() : ''}
                                </button>
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*tooltip doesn't work, may be hiding behind modal*/}
                  <PlusIconButton
                    type="submit"
                    variant="secondary"
                    handleClick={async (e: Event) => {
                      e.preventDefault();
                      await handleSubmit();
                      props.handleClose();
                    }}
                    title="Add new category"
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
