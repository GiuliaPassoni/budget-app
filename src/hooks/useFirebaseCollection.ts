import { createSignal, createEffect, onCleanup } from "solid-js";
import {
	collection,
	onSnapshot,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	DocumentData,
	CollectionReference,
	DocumentReference,
	Firestore,
} from "firebase/firestore";

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
	update: (id: string, item: Partial<TInput>) => Promise<void>;
	remove: (id: string) => Promise<void>;
	refresh: () => void;
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

	const update = async (id: string, item: Partial<TInput>): Promise<void> => {
		const docRef = getDocRef(id);
		if (!docRef) throw new Error("Invalid document reference");

		try {
			await updateDoc(docRef, item as DocumentData);
		} catch (err) {
			const error = err as Error;
			setError(`Failed to update document: ${error.message}`);
			throw err;
		}
	};

	const remove = async (id: string): Promise<void> => {
		const docRef = getDocRef(id);
		if (!docRef) throw new Error("Invalid document reference");

		try {
			await deleteDoc(docRef);
		} catch (err) {
			const error = err as Error;
			setError(`Failed to delete document: ${error.message}`);
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
		update,
		remove,
		refresh: setupListener,
	};
}
