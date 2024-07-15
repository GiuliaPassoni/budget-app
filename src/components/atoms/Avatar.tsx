import { Match, Switch } from "solid-js";

interface IProps {
	email?: string | null;
	name?: string | null;
	pic?: string | undefined;
}
export default function Avatar({ email, name, pic }: IProps) {
	// @ts-ignore
	const initials = name ?? name?.split(" ")[0][0] + name?.split(" ")[1][0];
	return (
		<Switch>
			<Match when={email && !name && !pic}>
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
			<Match when={name && !pic}>
				<div class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
					<span class="font-medium text-gray-600 dark:text-gray-300">
						{initials}
					</span>
				</div>
			</Match>
			<Match when={name && pic}>
				<img class="w-10 h-10 rounded-full" src={pic} alt="Avatar" />
			</Match>
		</Switch>
	);
}
