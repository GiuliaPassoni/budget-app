import BaseButton from "~/components/baseComponents/BaseButton";
import { auth } from "~/firebase";
import { handleLogOut } from "~/components/organisms/Authentication/login_helpers";
import { Toaster } from "solid-toast";
import Avatar from "~/components/atoms/Avatar";
import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function SignOutButton() {
	const user = auth.currentUser;
	const navigate = useNavigate();
	return (
		<Show when={user}>
			<Avatar
				email={user?.email}
				name={user?.displayName}
				pic={user?.photoURL}
			/>
			<BaseButton
				text="Sign out"
				onClick={() => {
					handleLogOut({ auth, userName: user?.email });
					navigate("/overview");
				}}
			></BaseButton>
			<Toaster />
		</Show>
	);
}
