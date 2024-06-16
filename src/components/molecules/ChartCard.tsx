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
				<button
					type="button"
					onClick={handleClick}
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<svg
						class="w-6 h-6 text-white dark:text-white"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 12h14m-7 7V5"
						/>
					</svg>
					<span class="sr-only"></span>
				</button>
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
