import { createSignal } from "solid-js";
import { auth } from "~/firebase";
import { Toaster } from "solid-toast";
import { handleSignUp } from "~/components/organisms/Authentication/login_helpers";
import { Route, Router, useNavigate } from "@solidjs/router";

interface UserI {
	id?: string;
	email: String;
	password: String;
	isLoggedIn?: boolean;
}
export default function Signup() {
	const [user, setUser] = createSignal<UserI>({ email: "", password: "" });
	// const [user, setUser] = createSignal<UserI>({ email: "", password: "" });
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");

	const navigate = useNavigate();

	return (
		<>
			<form
				class="max-w-sm mx-auto"
				onSubmit={(e) => {
					e.preventDefault();
					handleSignUp({ auth, email: email(), password: password() });
					navigate("/overview");
				}}
			>
				<div class="mb-5">
					<label
						for="email"
						class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>
						Your email
					</label>
					<input
						type="email"
						id="email"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="name@flowbite.com"
						required
						value={email()}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div class="mb-5">
					<label
						for="password"
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					>
						Your password
					</label>
					<input
						type="password"
						id="password"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required
						value={password()}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div class="flex items-start mb-5">
					<div class="flex items-center h-5">
						<input
							id="remember"
							type="checkbox"
							value=""
							class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
							required
						/>
					</div>
					<label
						// htmlFor="remember"
						class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>
						Remember me
					</label>
				</div>
				<button
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					// onClick={() => {
					// 	handleSignUp({ auth, email: email(), password: password() });
					// }}
				>
					Submit
				</button>
			</form>
			<Toaster />
		</>
	);
}
