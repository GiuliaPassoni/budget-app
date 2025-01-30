import {
	createContext,
	JSXElement,
	onCleanup,
	onMount,
	Show,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/firebase";
import { UserI } from "~/api/auth_types";
import { getUser } from "~/api/auth";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";

interface AuthStateContextI {
	isAuthenticated: boolean;
	loading: boolean;
	user: UserI | null;
	updateUser: (updatedProperties: Partial<UserI>) => void;
}

let AuthStateContext = createContext<AuthStateContextI>();

if (import.meta.hot) {
	if (!import.meta.hot.data.context) {
		import.meta.hot.data.context = createContext<AuthStateContextI>();
	}
	AuthStateContext = import.meta.hot.data.context;
} else {
	AuthStateContext = createContext<AuthStateContextI>();
}

export { AuthStateContext };

export default function AuthProvider(props: { children: JSXElement }) {
	const [store, setStore] = createStore<AuthStateContextI>({
		isAuthenticated: false,
		loading: true,
		user: null,
		updateUser: (updatedProperties: Partial<UserI>) => {
			setStore("user", (prevUser) => ({
				...prevUser,
				...updatedProperties,
			}));
		},
	});

	onMount(async () => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			// Add null check for HMR edge cases
			if (!unsubscribe) return;
			try {
				if (firebaseUser) {
					const appUser = await getUser(firebaseUser.uid);
					setStore({ isAuthenticated: true, user: appUser, loading: false });
				} else {
					setStore({ isAuthenticated: false, user: null, loading: false });
				}
			} catch (error) {
				console.error("Auth state error:", error);
				setStore({ isAuthenticated: false, user: null, loading: false });
			}
		});
		onCleanup(() => unsubscribe());
	});

	return (
		<AuthStateContext.Provider value={store}>
			<Show when={!store.loading} fallback={<FullPageLoader />}>
				{props.children}
			</Show>
		</AuthStateContext.Provider>
	);
}

const FullPageLoader = () => (
	<div class="w-screen h-screen grid place-items-center">
		<LoadingSpinner />
	</div>
);

export const useAuthState = () => {
	const context = useContext(AuthStateContext);

	// HMR workaround
	if (import.meta.env.DEV && !context) {
		return {
			isAuthenticated: false,
			loading: true,
			user: null,
		} as AuthStateContextI;
	}

	if (!context) {
		throw new Error("useAuthState must be used within an AuthProvider");
	}
	return context;
};
