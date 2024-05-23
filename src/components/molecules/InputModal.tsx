import BaseButton from "~/components/baseComponents/BaseButton";
import BaseModal from "~/components/baseComponents/BaseModal";
import { ModalProps } from "solid-bootstrap";
import { createEffect } from "solid-js";

export default function InputModal(props: Partial<ModalProps>){
  console.debug(props)
  return (
    <BaseModal
      showModal={props.showModal}
      handleClose={props.handleClose()}
      title="hi"
      body={<>This is a modal</>}
      footer={
        <>
          <BaseButton onClick={props.handleClose()}>Hi</BaseButton>
        </>
      }
    />
  )
}