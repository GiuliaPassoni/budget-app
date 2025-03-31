// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import "solid-devtools/setup";

mount(() => <StartClient />, document.getElementById("app")!);
