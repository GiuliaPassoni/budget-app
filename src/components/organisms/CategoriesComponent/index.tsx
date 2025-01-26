import CardWithIcon from "~/components/molecules/CardWithIcon";
import { createSignal, For } from "solid-js";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import { Toaster } from "solid-toast";
import MainLayout from "~/components/organisms/MainLayout";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import { CategoryI, CategoryWithId } from "~/helpers/types";
import { currentUser, db } from "~/firebase";
import { iconMap } from "~/components/atoms/icons/helpers";
import styles from "./style.module.css";
import { createStore } from "solid-js/store";

export default function CategoriesComponent() {
	const [showModal, setShowModal] = createSignal(false);

	const { data: categories } = useFirebaseCollection<CategoryI, CategoryWithId>(
		{
			db,
			collectionPath: () => {
				const userId = currentUser();
				return userId ? [`users/${currentUser()}/categories`] : undefined;
			},
		},
	);

	const [showEditModal, setShowEditModal] = createSignal<boolean>(false);
	const [editCategory, setEditCategory] = createStore<any>(); //todo fix type

	return (
		<MainLayout title="Categories">
			<div class={styles.container}>
				<div class={`${styles.categoryGrid}`}>
					<For each={categories()}>
						{(i) => (
							<CardWithIcon
								colour={i.colour}
								title={i.name}
								icon={i.iconName ? iconMap[i.iconName]?.() : ""}
								handleClick={() => {
									setEditCategory({ ...i, id: i.id });
									setShowEditModal(true);
								}}
							/>
						)}
					</For>
					<CardWithIcon
						colour="gray"
						title="Add category"
						icon={iconMap["plus"]}
						handleClick={() => {
							setShowModal(true);
						}}
					/>
				</div>
			</div>
			<AddCategoryModal
				isEditCategoryModal={false}
				showModal={showModal()}
				handleClose={() => setShowModal(false)}
				onSubmit={() => setShowModal(false)}
			/>
			<AddCategoryModal
				isEditCategoryModal={showEditModal()}
				showModal={showEditModal()}
				categoryToEdit={editCategory}
				handleClose={() => setShowEditModal(false)}
				onSubmit={() => setShowEditModal(false)}
			/>
			<Toaster />
		</MainLayout>
	);
}
