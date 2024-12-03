import { createContext, JSXElement, onMount, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";

interface IProps {
	children: JSXElement;
}

interface AuthStateContextI {
	isAuthenticated: boolean;
	loading: boolean;
}

function initialState() {
	return {
		isAuthenticated: false,
		loading: true,
	};
}

const AuthStateContext = createContext<AuthStateContextI>();

export default function AuthProvider(props: IProps) {
	const [store, setStore] = createStore(initialState());

	onMount(async () => {
		try {
			await authenticateUser();
			// const isAuthenticated = localStorage.getItem("isAuthenticated");
			// if (isAuthenticated) {
			setStore("isAuthenticated", true);
			// }
		} catch (error) {
			console.error(error);
			setStore("isAuthenticated", false);
		} finally {
			setStore("loading", false);
		}
	});

	const authenticateUser = async () => {
		return new Promise((res) => {
			setTimeout(() => {
				setStore("isAuthenticated", true);
				res(true);
			}, 1000);
		});
	};

	return (
		<AuthStateContext.Provider value={store}>
			<Show when={store.loading} fallback={props.children}>
				<LoadingSpinner />
			</Show>
		</AuthStateContext.Provider>
	);
}

export const useAuthState = () => useContext(AuthStateContext);
