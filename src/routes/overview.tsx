import { Title } from "@solidjs/meta";
import ChartCard from "~/components/molecules/ChartCard";
import { testGET } from "~/firebase";

export default function Overview() {
  const testGetHere = testGET();
  console.debug(testGetHere);
  return (
    <main>
      <Title>Overview</Title>
      <h1>Your transaction overview</h1>
      <ChartCard />
    </main>
  );
}
