interface PropsI {
  label: string;
  handleClick(): void;
}

export default function TabButton(props: PropsI) {
  return (
    <button
      class="inline-block p-2 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      id="income-styled-tab"
      data-tabs-target="#styled-income"
      type="button"
      role="tab"
      aria-controls="income"
      aria-selected="false"
      onClick={props.handleClick}
    >
      {props.label}
    </button>
  );
}
