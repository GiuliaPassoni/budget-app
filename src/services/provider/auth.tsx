import { createContext, JSXElement, onMount, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import LoadingSpinner from "~/components/atoms/LoadingSpinner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/firebase";
import { UserI } from "~/api/auth_types";
import { useLocation, useNavigate } from "@solidjs/router";
import { getUser } from "~/api/auth";

interface IProps {
	children: JSXElement;
}

interface AuthStateContextI {
	isAuthenticated: boolean;
	loading: boolean;
	user: UserI | null;
}

function initialState() {
	return {
		isAuthenticated: false,
		loading: true,
		user: null,
	};
}

const AuthStateContext = createContext<AuthStateContextI>();
// fixme repetition in firebase.ts state
export default function AuthProvider(props: IProps) {
	const [store, setStore] = createStore<AuthStateContextI>(initialState());
	const location = useLocation();
	const navigate = useNavigate();

	function handleAuthChanges() {
		console.log(location.pathname);
		return onAuthStateChanged(auth, async (user) => {
			if (!!user) {
				const appUser = await getUser(user.uid);
				setStore("isAuthenticated", true);
				setStore("user", appUser); //todo fix type
				// if (location.pathname.includes("./login")) {
				// 	navigate("/auth/overview", { replace: true });
				// }
			} else {
				setStore("isAuthenticated", false);
				setStore("user", null);
			}
			setStore("loading", false);
		});
	}

	onMount(() => {
		setStore("loading", true);
		handleAuthChanges();
	});

	return (
		<AuthStateContext.Provider value={store}>
			<Show when={store.loading} fallback={props.children}>
				<div class="w-screen h-screen">
					<div class="mx-auto my-auto">
						<LoadingSpinner />
					</div>
				</div>
			</Show>
		</AuthStateContext.Provider>
	);
}

export const useAuthState = () => useContext(AuthStateContext);
