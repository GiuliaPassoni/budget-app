import { Card } from "solid-bootstrap";
import BaseCard from "~/components/baseComponents/BaseCard";
import PieChart from "~/components/atoms/PieChart";
import { createEffect, createSignal } from "solid-js";
import InputModal from "~/components/molecules/InputModal";
import BaseButton from "~/components/baseComponents/BaseButton";

export default function ChartCard(props: any) {
	const [showModal, setShowModal] = createSignal(false);

	function handleClick() {
		setShowModal(!showModal());
	}

	createEffect(() => {
		console.debug(showModal());
	});

	return (
		<BaseCard
			title={props.title}
			class="content-center items-center justify-center"
		>
			{props.children}
			<BaseButton text="Button that will expand view" />
		</BaseCard>
	);
}
