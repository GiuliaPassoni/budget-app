import CardWithIcon from "~/components/molecules/CardWithIcon";
import { createSignal, For } from "solid-js";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import { Toaster } from "solid-toast";
import MainLayout from "~/components/organisms/MainLayout";
import { useFirebaseCollection } from "~/hooks/useFirebaseCollection";
import { CategoryI, CategoryWithId, TransactionType } from "~/helpers/types";
import { currentUser } from "~/firebase";
import { iconMap } from "~/components/atoms/icons/helpers";
import styles from "./style.module.css";
import { createStore } from "solid-js/store";
import Tabs from "~/components/molecules/Tabs";

type CategoryType = "expenses" | "income" | "investments";

interface CategoryGridProps {
	type: CategoryType;
	categories: CategoryWithId[];
	onEditCategory: (category: CategoryWithId) => void;
	onAddCategory: () => void;
}

const CategoryGrid = (props: CategoryGridProps) => {
	const gridStyles = {
		expenses: styles.expensesCategories,
		income: styles.incomeCategories,
		investments: styles.investingCategories,
	};

	return (
		<div class={`${styles.categoryGrid} ${gridStyles[props.type]}`}>
			<For each={props.categories.filter((i) => i.type === props.type)}>
				{(category) => (
					<CardWithIcon
						colour={category.colour}
						title={category.name}
						icon={category.iconName ? iconMap[category.iconName]?.() : ""}
						handleClick={() => props.onEditCategory(category)}
					/>
				)}
			</For>
			<CardWithIcon
				colour="gray"
				title="Add category"
				icon={iconMap["plus"]}
				handleClick={props.onAddCategory}
			/>
		</div>
	);
};

export default function CategoriesComponent() {
	const [showModal, setShowModal] = createSignal(false);
	const [showEditModal, setShowEditModal] = createSignal<boolean>(false);
	const [editCategory, setEditCategory] = createStore<any>(); //todo fix type

	const { data: categories } = useFirebaseCollection<CategoryI, CategoryWithId>(
		{
			collectionPath: () => {
				const userId = currentUser();
				return userId ? [`users/${currentUser()}/categories`] : undefined;
			},
		},
	);

	const handleEditCategory = (category: CategoryWithId) => {
		setEditCategory({ ...category, id: category.id });
		setShowEditModal(true);
	};

	const transactionTypes: TransactionType[] = [
		"expenses",
		"income",
		"investments",
	];

	const tabs = transactionTypes.map((type) => ({
		name: type,
		content: (
			<CategoryGrid
				type={type}
				categories={categories()}
				onEditCategory={handleEditCategory}
				onAddCategory={() => setShowModal(true)}
			/>
		),
	}));

	return (
		<MainLayout title="Categories">
			<Tabs tabs={tabs} />

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
