import { createEffect, createSignal } from 'solid-js';
import Button from '~/components/atoms/Button';
import Card from '~/components/atoms/Card';

export default function ChartCard(props: any) {
  const [showModal, setShowModal] = createSignal(false);

  function handleClick() {
    setShowModal(!showModal());
  }

  createEffect(() => {
    console.debug(showModal());
  });

  return (
    <Card
      title={props.title}
      class="content-center items-center justify-center"
    >
      {props.children}
      <Button
        text="Button that will expand view"
        onClick={() => handleClick()}
      />
    </Card>
  );
}
