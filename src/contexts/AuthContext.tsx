// src/contexts/AuthContext.tsx
import { createContext, useContext, createSignal } from "solid-js";
import { Auth, User, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "solid-toast";

type AuthContextType = {
	user: () => User | null;
	signUp: (auth: Auth, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>();

export function AuthProvider(props: any) {
	const [user, setUser] = createSignal<User | null>(null);
	const signUp = async (auth: Auth, email: string, password: string) => {
		return createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed up
				setUser(userCredential.user);
				toast.success("User signed up successfully");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				toast.error(errorCode, errorMessage);
			});
	};

	return (
		<AuthContext.Provider value={{ user, signUp }}>
			{props.children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
