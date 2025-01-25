import { createEffect, createSignal, onCleanup } from "solid-js";
import {
	addDoc,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	DocumentData,
	DocumentReference,
	Firestore,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { currentUser } from "~/firebase";
import { toast } from "solid-toast";
import { CategoryI } from "~/helpers/types";

interface getItemPropsI {
	dbName: string;
	id?: string | null;
	name?: string;
}

interface updateItemPropsI {
	dbName: string;
	itemRef: string;
	updatedValue: any;
}

interface DeleteItemPropsI {
	dbName: string;
	itemRef: string;
}

interface UseFirebaseCollectionProps<TInput, TOutput extends { id: string }> {
	db: Firestore;
	collectionPath: () => string[] | undefined; // Now accepts a function that returns path segments
	requireAuth?: boolean;
	transform?: (data: DocumentData & { id: string }) => TOutput;
}

interface UseFirebaseCollectionReturn<TInput, TOutput> {
	data: () => TOutput[];
	loading: () => boolean;
	error: () => string | null;
	add: (item: TInput) => Promise<string>;
	getItemByIdOrName: ({ dbName, id, name }: getItemPropsI) => Promise<any>;
	updateItem: ({
		dbName,
		itemRef,
		updatedValue,
	}: updateItemPropsI) => Promise<void>;
	deleteItem: ({ dbName, itemRef }: DeleteItemPropsI) => Promise<void>;
	refresh: () => void;
	// getById: (id: string) => Promise<TOutput | null>;
	// getByField: (field: keyof TInput, value: any) => Promise<TOutput[]>;
	// listenToOne: (
	// 	id: string,
	// 	callback: (item: TOutput | null) => void,
	// ) => () => void;
}

export function useFirebaseCollection<
	TInput extends Omit<TOutput, "id">,
	TOutput extends { id: string },
>({
	db,
	collectionPath,
	requireAuth = true,
	transform = (data) => ({ ...data }) as TOutput,
}: UseFirebaseCollectionProps<TInput, TOutput>): UseFirebaseCollectionReturn<
	TInput,
	TOutput
> {
	const [data, setData] = createSignal<TOutput[]>([]);
	const [loading, setLoading] = createSignal(true);
	const [error, setError] = createSignal<string | null>(null);
	let unsubscribe: (() => void) | undefined;

	const getCollectionRef = (): CollectionReference<DocumentData> | null => {
		const path = collectionPath();
		if (!path) return null;

		const fullPath = path.join("/");
		return collection(db, fullPath);
	};

	const getDocRef = (id: string): DocumentReference<DocumentData> | null => {
		const collectionRef = getCollectionRef();
		if (!collectionRef) return null;
		return doc(collectionRef, id);
	};

	const setupListener = () => {
		setLoading(true);
		setError(null);

		// Cleanup previous listener if it exists
		if (unsubscribe) {
			unsubscribe();
		}

		const path = collectionPath();
		if (!path) {
			if (requireAuth) {
				setError("User not authenticated");
			}
			setLoading(false);
			return;
		}

		const collectionRef = getCollectionRef();
		if (!collectionRef) {
			setError("Invalid collection path");
			setLoading(false);
			return;
		}

		unsubscribe = onSnapshot(
			collectionRef,
			(snapshot) => {
				const items = snapshot.docs.map((doc) => {
					return transform({ ...doc.data(), id: doc.id });
				});
				setData(items);
				setLoading(false);
			},
			(err) => {
				setError(`Failed to load collection: ${err.message}`);
				console.error(err);
				setLoading(false);
			},
		);
	};

	// todo simplify hook and update implementation to be from hook instead of catg helpers
	const getItemByIdOrName = async ({ dbName, id, name }: getItemPropsI) => {
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
	};

	const add = async (item: TInput): Promise<string> => {
		const collectionRef = getCollectionRef();
		if (!collectionRef) throw new Error("Invalid collection reference");

		try {
			const docRef = await addDoc(collectionRef, item);
			return docRef.id;
		} catch (err) {
			const error = err as Error;
			setError(`Failed to add document: ${error.message}`);
			throw err;
		}
	};

	const updateItem = async ({
		dbName,
		itemRef,
		updatedValue,
	}: updateItemPropsI): Promise<void> => {
		// const docRef = getDocRef(id);
		const reference = doc(db, "users", currentUser(), dbName, itemRef);
		if (!itemRef) throw new Error("Invalid document reference");

		try {
			const update = await updateDoc(reference, updatedValue);
			return update;
			toast.success("Item update successfully");
		} catch (err) {
			const error = err as Error;
			setError(`Failed to update document: ${error.message}`);
			toast.error(`Failed to update document: ${error.message}`);
			throw err;
		}
	};

	const deleteItem = async ({
		dbName,
		itemRef,
	}: DeleteItemPropsI): Promise<void> => {
		// const docRef = getDocRef(id);
		if (!itemRef) throw new Error("Invalid document reference");

		try {
			return await deleteDoc(doc(db, "users", currentUser(), dbName, itemRef));
			toast.success("Item deleted successfully");
		} catch (err) {
			const error = err as Error;
			setError(`Failed to delete document: ${error.message}`);
			toast.error(`Error deleting document: ${error.message}`);
			throw err;
		}
	};

	// Setup effect to watch for path changes
	createEffect(() => {
		setupListener();
	});

	// Cleanup on unmount
	onCleanup(() => {
		if (unsubscribe) {
			unsubscribe();
		}
	});

	return {
		data,
		loading,
		error,
		add,
		getItemByIdOrName,
		updateItem,
		deleteItem,
		refresh: setupListener,
	};
}
