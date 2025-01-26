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
				<h3>Expenses</h3>
				<div class={`${styles.categoryGrid} ${styles.expensesCategories}`}>
					<For each={categories().filter((i) => i.type === "expenses")}>
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
				</div>
				<h3>Income</h3>
				<div class={`${styles.categoryGrid} ${styles.incomeCategories}`}>
					<For each={categories().filter((i) => i.type === "income")}>
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
				</div>
				<h3>Investing</h3>
				<div class={`${styles.categoryGrid} ${styles.investingCategories}`}>
					<For each={categories().filter((i) => i.type === "investments")}>
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
				</div>
				<CardWithIcon
					colour="gray"
					title="Add category"
					icon={iconMap["plus"]}
					handleClick={() => {
						setShowModal(true);
					}}
				/>
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
