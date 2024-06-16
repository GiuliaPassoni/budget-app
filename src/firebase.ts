// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC4laW_8yNr-StZDOONA3vb-KgTAMfFZH4",
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

export { app, auth };

// export default async function hello() {
// 	try {
// 		const docRef = await addDoc(collection(db, "users"), {
// 			first: "Ada",
// 			last: "Lovelace",
// 			born: 1815,
// 		});
// 		console.log("Document written with ID: ", docRef.id);
// 	} catch (e) {
// 		console.error("Error adding document: ", e);
// 	}
//
// 	const querySnapshot = await getDocs(collection(db, "users"));
// 	querySnapshot.forEach((doc) => {
// 		const m = { ...doc.data() };
// 		console.log(`${doc.id} => ${m}`);
// 	});
// }

export async function addUser(props: { name: any; email: any }) {
	try {
		const docRef = await addDoc(collection(db, "users"), {
			name: props.name,
			email: props.email,
		});
		console.log("Document written with ID: ", docRef.id);
	} catch (e) {
		console.error("Error adding document: ", e);
	}
}

export async function getUsers() {
	let allUsers: any[] = [];
	const querySnapshot = await getDocs(collection(db, "users"));
	querySnapshot.forEach((doc) => {
		const m = { ...doc.data() };
		allUsers.push(`${doc.id} => ${m}`);
	});
	return allUsers;
}
