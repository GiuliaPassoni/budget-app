import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import NavBar from "~/components/organisms/NavBar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <NavBar />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
