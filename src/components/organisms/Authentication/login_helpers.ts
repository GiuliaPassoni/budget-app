import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { toast } from "solid-toast";

interface SignUpPropsI {
	auth: any;
	email: string;
	password: string;
}

async function handleSignUp({ auth, email, password }: SignUpPropsI) {
	return createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed up
			const user = userCredential.user;
			console.debug(
				"User",
				user,
				"has signed up, with credentials",
				userCredential,
			);
			toast.success("User signed up successfully");
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			toast.error(errorMessage);
		});
}

interface SignInProps {
	auth: any;
	email: string;
	password: string;
}

async function handleSignIn({ auth, email, password }: SignInProps) {
	return signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			const user = userCredential.user;
			console.debug("User", user, "has signed in");
			toast.success(`User ${user} has signed in`);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			toast.error(errorMessage);
		});
}

interface ILogOut {
	auth: any;
	userName: string | null | undefined;
}

function handleLogOut({ auth, userName }: ILogOut) {
	auth
		.signOut()
		.then(() => {
			toast.success("User logged out");
		})
		.catch((error: Error) => {
			const errorMessage = error.message;
			toast.error(errorMessage);
		});
}

// the below doesn't work atm (15/07/24)
function getUserInfo(auth: any) {
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
