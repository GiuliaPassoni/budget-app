// First, make sure your CategoryI interface includes id
interface CategoryI {
	id: string; // Required by the hook
	name: string;
	// ... other properties
}

import { createSignal, onCleanup } from "solid-js";
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

// Modified to handle both input and output types
interface UseFirebaseCollectionProps<TInput, TOutput extends { id: string }> {
	db: Firestore;
	collectionPath: string[];
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
	transform = (data) => ({ ...data }) as TOutput,
}: UseFirebaseCollectionProps<TInput, TOutput>): UseFirebaseCollectionReturn<
	TInput,
	TOutput
> {
	const [data, setData] = createSignal<TOutput[]>([]);
	const [loading, setLoading] = createSignal(true);
	const [error, setError] = createSignal<string | null>(null);

	const getCollectionRef = (): CollectionReference<DocumentData> => {
		let ref: CollectionReference<DocumentData> = collection(
			db,
			collectionPath[0],
		);
		for (let i = 1; i < collectionPath.length; i++) {
			ref = collection(ref, collectionPath[i]);
		}
		return ref;
	};

	const getDocRef = (id: string): DocumentReference<DocumentData> => {
		return doc(getCollectionRef(), id);
	};

	const setupListener = () => {
		setLoading(true);
		setError(null);

		const collectionRef = getCollectionRef();
		const unsubscribe = onSnapshot(
			collectionRef,
			(snapshot) => {
				const items = snapshot.docs.map((doc) => {
					return transform({ ...doc.data(), id: doc.id });
				});
				setData(items);
				setLoading(false);
			},
			(err) => {
				setError(`Failed to load ${collectionPath.join("/")}: ${err.message}`);
				console.error(err);
				setLoading(false);
			},
		);

		onCleanup(() => unsubscribe());
	};

	const add = async (item: TInput): Promise<string> => {
		try {
			const docRef = await addDoc(getCollectionRef(), item);
			return docRef.id;
		} catch (err) {
			const error = err as Error;
			setError(`Failed to add document: ${error.message}`);
			throw err;
		}
	};

	const update = async (id: string, item: Partial<TInput>): Promise<void> => {
		try {
			await updateDoc(getDocRef(id), item as DocumentData);
		} catch (err) {
			const error = err as Error;
			setError(`Failed to update document: ${error.message}`);
			throw err;
		}
	};

	const remove = async (id: string): Promise<void> => {
		try {
			await deleteDoc(getDocRef(id));
		} catch (err) {
			const error = err as Error;
			setError(`Failed to delete document: ${error.message}`);
			throw err;
		}
	};

	setupListener();

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
