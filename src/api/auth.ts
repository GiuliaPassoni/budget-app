import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import { toast } from "solid-toast";
import { auth, db, setCurrentUser } from "~/firebase";
import { collection, doc, getDocs, setDoc, getDoc } from "firebase/firestore";
import { AuthForm, RegisterForm } from "~/helpers/forms/formTypes";
import { UserI } from "~/api/auth_types";

async function handleRegister(form: RegisterForm) {
	const { user: registeredUser } = await createUserWithEmailAndPassword(
		auth,
		form.email,
		form.password,
	);
	try {
		// save user data to follow the UserI interface
		const user: UserI = {
			uid: registeredUser.uid,
			name: form.name,
			email: form.email,
			password: form.password,
			// avatar: form.avatar,
			selected_currency: "",
		};

		// save user in db
		await setDoc(doc(db, "users", registeredUser.uid), user);
		await addUser({ user });
		toast.success("User signed up successfully");
		return registeredUser;
	} catch (error: any) {
		const errorCode = error.code;
		const errorMessage = error.message;
		toast.error(errorMessage, errorCode);
	}
	// then - catch !== async - await + try and catch
}

async function handleLogIn(form: AuthForm) {
	console.debug("hi");
	const { user: registeredUser } = await signInWithEmailAndPassword(
		auth,
		form.email,
		form.password,
	);
	try {
		toast.success(`User ${registeredUser.email} has signed in`);
	} catch (error: any) {
		const errorMessage = error.message;
		toast.error(errorMessage);
	}
}

type PropsT = {
	type: "signup" | "login";
	form: AuthForm;
};

function handleAuthenticate({ form, type }: PropsT) {
	return type === "login"
		? handleLogIn(form)
		: handleRegister(form as RegisterForm);
}

async function handleLogOut() {
	await auth.signOut();
	try {
		toast.success("User logged out");
		window.location.reload(); //todo check this
		setCurrentUser(null);
	} catch (error: any) {
		const errorMessage = error.message;
		toast.error(errorMessage);
	}
}

function getUserInfo() {
	return onAuthStateChanged(auth, (user) => {
		if (!!user) {
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

type Props = {
	user: any;
};

export default async function addUser({ user }: Props) {
	try {
		await setDoc(doc(db, "users", user.uid), {
			auth_uid: user.uid,
			email: user.email,
		});
		toast.success("User added to db");
	} catch (e) {
		console.error("Error adding user: ", e);
		toast.error("Error adding user to db");
	}
}

const getUsers = async () => {
	const usersCollec = collection(db, "users"),
		userSnap = await getDocs(usersCollec),
		usersList = userSnap.docs.map((doc) => doc.data());
	return usersList;
};

const getUser = async (uid: string) => {
	const userRef = doc(db, "users", uid);
	const snapshot = await getDoc(userRef);
	return snapshot.data() as UserI;
};

export {
	handleRegister,
	handleLogIn,
	handleLogOut,
	handleAuthenticate,
	getUserInfo,
	getUser,
	getUsers,
};
