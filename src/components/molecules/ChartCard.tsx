import { Card } from "solid-bootstrap";
import BaseCard from "~/components/baseComponents/BaseCard";
import BaseButton from "~/components/baseComponents/BaseButton";
import PieChart from "~/components/atoms/PieChart";
import { createEffect, createSignal } from "solid-js";
import InputModal from "~/components/molecules/InputModal";

export default function ChartCard() {
	const [showModal, setShowModal] = createSignal(false);
	function handleClick() {
		setShowModal(!showModal());
	}

	createEffect(() => {
		console.debug(showModal());
	});

	return (
		<BaseCard
			class="mx-auto center-text"
			style={{ padding: "2rem", width: "25vw" }}
			bg="light"
			border="info"
		>
			<Card.Body>
				<Card.Title>Expenses overview</Card.Title>
				<Card style={{ margin: "1rem", padding: "2rem" }}>
					<PieChart w={50} h={50} r={50} />
				</Card>
				<BaseButton
					onClick={handleClick}
					variant="warning"
					style="border-radius:50%"
				>
					+
				</BaseButton>
			</Card.Body>
			<InputModal
				showModal={showModal()}
				handleClose={() => {
					setShowModal(false);
					console.debug("hi");
				}}
			/>
		</BaseCard>
	);
}
