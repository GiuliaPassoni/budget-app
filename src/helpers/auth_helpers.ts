import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { toast } from "solid-toast";
import { auth, setCurrentUser } from "~/firebase";

export interface SignUpPropsI {
	email: string;
	password: string;
}

async function handleSignUp({ email, password }: SignUpPropsI) {
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		password,
	);
	try {
		const user = userCredential.user;
		toast.success("User signed up successfully");
		return user;
	} catch (error: any) {
		const errorCode = error.code;
		const errorMessage = error.message;
		toast.error(errorMessage, errorCode);
	}
	// then - catch !== async - await + try and catch
	// .then((userCredential) => {

	// 	toast.success("User signed up successfully");
	// })
	// .catch((error) => {

	// });
}

export interface SignInProps {
	email: string;
	password: string;
}

function handleSignIn({ email, password }: SignInProps) {
	console.debug("sign in called");
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			console.debug("User", user, "has signed in");
			toast.success(`User ${user.uid} has signed in`);
		})
		.catch((error) => {
			const errorMessage = error.message;
			toast.error(errorMessage);
		});
}

interface ILogOut {}

function handleLogOut({}: ILogOut) {
	console.debug("log out called");
	auth
		.signOut()
		.then(() => {
			toast.success("User logged out");
			console.debug("User logged out");
			setCurrentUser(null);
		})
		.catch((error: Error) => {
			const errorMessage = error.message;
			toast.error(errorMessage);
		});
}

function getUserInfo() {
	return onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/auth.user
			const uid = user.uid;
			console.debug("User with id", uid, "is logged in");
			console.debug("User data: ", user);
		} else {
			// User is signed out
			console.debug("User is signed out");
		}
	});
}

export { handleSignUp, handleSignIn, handleLogOut, getUserInfo };
