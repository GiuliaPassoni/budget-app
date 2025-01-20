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
								handleClick={() => {}}
							/>
						)}
					</For>
					<CardWithIcon
						colour="gray"
						title="More"
						icon={iconMap["plus"]}
						handleClick={() => {
							setShowModal(true);
						}}
					/>
				</div>
			</div>
			<AddCategoryModal
				showModal={showModal()}
				handleClose={() => setShowModal(false)}
				onSubmit={() => setShowModal(false)}
			/>
			<Toaster />
		</MainLayout>
	);
}
