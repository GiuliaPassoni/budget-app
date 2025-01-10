import { Toaster } from "solid-toast";
import Avatar from "~/components/atoms/Avatar";
import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { handleLogOut } from "~/helpers/auth_helpers";
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
				leftIcon={
					<Avatar
						email={user?.email}
						name={user?.displayName}
						pic={user?.photoURL}
					/>
				}
				onClick={() => {
					navigate("/overview");
					handleLogOut({ userName: user?.email });
				}}
			/>
			<Toaster />
		</Show>
	);
}
