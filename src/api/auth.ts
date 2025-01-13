import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { toast } from "solid-toast";
import { auth, db, setCurrentUser } from "~/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface RegisterPropsI {
	email: string;
	password: string;
}

async function registerUser({ email, password }: RegisterPropsI) {
	const userCredentials = await createUserWithEmailAndPassword(
		auth,
		email,
		password,
	);
	try {
		const user = userCredentials.user;
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
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			toast.success(`User ${user.email} has signed in`);
		})
		.catch((error) => {
			const errorMessage = error.message;
			toast.error(errorMessage);
		});
}

interface ILogOut {}

function handleLogOut({}: ILogOut) {
	auth
		.signOut()
		.then(() => {
			toast.success("User logged out");
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

export const getUsers = async () => {
	const usersCollec = collection(db, "users"),
		userSnap = await getDocs(usersCollec),
		usersList = userSnap.docs.map((doc) => doc.data());
	return usersList;
};

export { registerUser, handleSignIn, handleLogOut, getUserInfo };
