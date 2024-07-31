// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createSignal } from "solid-js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "budget-c4388.firebaseapp.com",
	projectId: "budget-c4388",
	storageBucket: "budget-c4388.appspot.com",
	messagingSenderId: "859846093671",
	appId: "1:859846093671:web:d2091347f3077ee2a21dc2",
	measurementId: "G-W5FS7GFSQQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const [currentUser, setCurrentUser] = createSignal<any>();

export { app, auth, db };

export { currentUser, setCurrentUser };

onAuthStateChanged(auth, (firebaseUser) => {
	if (firebaseUser !== null) {
		console.debug("state changed", firebaseUser.uid);
		setCurrentUser(firebaseUser.uid);
	}
});
