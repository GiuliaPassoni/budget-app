import { Match, Show, Switch } from 'solid-js';

interface IProps {
  email?: string;
  name?: string;
  pic?: string;
}

function extractInitials(name: string | undefined) {
  if (!name) return;
  return name.split(' ')[0][0] + name.split(' ')[1][0];
}
export default function Avatar(props: IProps) {
  const initials = props.name ?? extractInitials(props.name);
  return (
    <Switch>
      <Match when={props.email && !props.name && !props.pic}>
        <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg
            class="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </Match>
      <Match when={props.name && !props.pic}>
        <div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span class="font-medium text-gray-600 dark:text-gray-300">
            {initials}
          </span>
        </div>
      </Match>
      <Show when={props.pic}>
        <Match when={props.name && props.pic}>
          <img class="w-10 h-10 rounded-full" src={props.pic} alt="Avatar" />
        </Match>
      </Show>
    </Switch>
  );
}
