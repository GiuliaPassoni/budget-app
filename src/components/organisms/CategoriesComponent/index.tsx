import StarIcon from "~/components/atoms/icons/StarIcon";
import MoonIcon from "~/components/atoms/icons/MoonIcon";
import SunIcon from "~/components/atoms/icons/SunIcon";
import Card from "~/components/atoms/Card";
import CardWithIcon from "~/components/molecules/CardWithIcon";
import PlusIconButton from "~/components/atoms/PlusIconButton";
import { createSignal } from "solid-js";
import AddCategoryModal from "~/components/molecules/AddCategoryModal";
import { Toaster } from "solid-toast";
import MainLayout from "~/components/organisms/MainLayout";

import "./style.css";

export default function CategoriesComponent() {
	const [showModal, setShowModal] = createSignal(false);
	return (
		<MainLayout title="Categories">
			<div class="container">
				<Card>Tab with income categories</Card>
				<Card>Tab with expense categories</Card>
				<Card>Tab with investing categories</Card>
				<CardWithIcon icon={<StarIcon />} title="Star income" />
				<CardWithIcon icon={<MoonIcon />} title="Moon income" />
				<CardWithIcon icon={<SunIcon />} title="Sun income" />
				<CardWithIcon
					title="Add category"
					icon={
						<PlusIconButton
							variant="secondary"
							type="submit"
							handleClick={() => {
								setShowModal(true);
							}}
							title="Add category"
						/>
					}
				/>
				<AddCategoryModal
					showModal={showModal()}
					handleClose={() => setShowModal(false)}
					onSubmit={() => setShowModal(false)}
				/>
				<Toaster />
			</div>
		</MainLayout>
	);
}
