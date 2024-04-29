import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import BaseButton from "~/components/baseComponents/BaseButton";
import BaseCard from "~/components/baseComponents/BaseCard";
import Circle from "~/components/atoms/PieChart";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
        <BaseButton variant="outline-secondary" size="sm">Hi</BaseButton>
      <BaseCard>
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </BaseCard>
        <Circle/>
    </main>
  );
}
