import { Card } from "solid-bootstrap";

export default function BaseCard(props: any) {
	const { ...rest } = props;
	return <Card {...rest} />;
}
