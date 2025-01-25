import { Toaster } from "solid-toast";
import Avatar from "~/components/atoms/Avatar";
import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { handleLogOut } from "~/api/auth";
import { auth } from "~/firebase";
import Button from "~/components/atoms/Button";

// todo refactor with https://flowbite.com/docs/components/dropdowns/#user-avatar
export default function SignOutButton() {
	const user = auth.currentUser;
	const navigate = useNavigate();
	return (
		<Show when={user}>
			<Button
				styleClass="secondary"
				text="Sign out button"
				onClick={async () => {
					await handleLogOut();
					navigate("/auth/overview");
				}}
			/>
			<Toaster />
		</Show>
	);
}
