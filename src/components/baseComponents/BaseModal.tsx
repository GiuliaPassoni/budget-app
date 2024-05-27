import { Button, Modal } from "solid-bootstrap";
import { createSignal } from "solid-js";

interface ModalProps {
  showModal?: boolean;
  handleClose: () => void;
  title?: string;
  body: any;
  footer: any;
}

export default function BaseModal(props: ModalProps) {
  const { ...rest } = props;
  return (
    <Modal show={props.showModal} onHide={props.handleClose} {...rest}>
      <Modal.Header closeButton>
        {props.title && <Modal.Title>{props.title}</Modal.Title>}
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>{props.footer}</Modal.Footer>
    </Modal>
  );
}
