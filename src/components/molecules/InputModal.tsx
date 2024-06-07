import BaseButton from "~/components/baseComponents/BaseButton";
import BaseModal from "~/components/baseComponents/BaseModal";
import { ModalProps, Tab, Tabs } from "solid-bootstrap";
import { createSignal } from "solid-js";
import InputModalTabContent from "~/components/molecules/InputModalTabContent";

export default function InputModal(props: Partial<ModalProps>) {
	const [key, setKey] = createSignal("home");

	return (
		<BaseModal
			showModal={props.showModal}
			handleClose={props.handleClose()}
			title="Record your transaction"
			body={
				<Tabs>
					<Tab eventKey="expense" title="Expense">
						<InputModalTabContent />
					</Tab>
					<Tab eventKey="income" title="Income">
						<InputModalTabContent />
					</Tab>
				</Tabs>
			}
			footer={<BaseButton onClick={props.handleClose()}>Hi</BaseButton>}
		/>
	);
}
