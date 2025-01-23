import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { currentUser, db } from "~/firebase";
import { toast } from "solid-toast";
import { CategoryI } from "~/helpers/types";

interface PropsI {
	category: CategoryI;
}

export async function addNewCategory(props: PropsI) {
	try {
		await addDoc(collection(db, "users", currentUser(), "categories"), {
			...props.category,
			user_id: currentUser(),
		});
		toast.success("New category added");
	} catch (e) {
		console.error("Error adding category: ", e);
		toast.error("Error adding category");
	}
}

export async function getCategories() {
	try {
		let allCategories: CategoryI[] = [];
		const querySnapshot = await getDocs(
			collection(db, "users", currentUser(), "categories"),
		);
		querySnapshot.forEach((doc) => {
			const data = doc.data() as CategoryI; // Type assertion
			allCategories.push(data);
		});
		return allCategories;
	} catch (e) {
		console.error(
			"Error retrieving categories: ",
			e instanceof Error ? e.message : e,
		);
	}
}

type Props = {
	dbName: string;
	id?: string | null;
	name?: string;
};

export async function getItemByIdOrName({ dbName, id, name }: Props) {
	const collectionRef = collection(db, "users", currentUser(), dbName);
	if (name) {
		// If we have a name, query by name field
		const q = query(collectionRef, where("name", "==", name));
		const snapshot = await getDocs(q);

		console.debug(snapshot);
		if (!snapshot.empty) {
			const doc = snapshot.docs[0];
			return {
				data: doc.data() as CategoryI,
				id: doc.id,
			};
		}
	} else if (id && id !== "") {
		// If we have a valid ID, get the document directly
		const docRef = doc(db, dbName, id);
		const snapshot = await getDoc(docRef);

		if (snapshot.exists()) {
			return {
				data: snapshot.data() as CategoryI,
				id: snapshot.id,
			};
		}
	} else {
		throw new Error("Either category id or name must be provided");
	}
}

interface PropsItem {
	dbName: string;
	itemRef: string;
	valueKey: string;
	newValue: any;
}

export async function updateItem({
	dbName,
	itemRef,
	valueKey,
	newValue,
}: PropsItem) {
	const reference = doc(db, "users", currentUser(), dbName, itemRef);
	try {
		const update = await updateDoc(reference, {
			[valueKey]: newValue,
		});
		return update;
		toast.success("Item update successfully");
	} catch (error: any) {
		console.error("Error updating document: ", error);
		toast.error("Error updating document: ", error.message);
	}
}
