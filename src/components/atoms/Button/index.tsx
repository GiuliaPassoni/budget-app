// TODO check out https://tailwindcss.com/docs/reusing-styles for reusability
export default function Button(props: any) {
  return (
    <button
      onClick={props.onClick}
      class="inline-flex items-center px-3 py-2
			text-sm font-medium text-center text-white
			bg-blue-700 dark:bg-blue-600
			rounded-lg
			hover:bg-blue-800 dark:hover:bg-blue-700
			focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
    >
      {props.text}
    </button>
  );
}
