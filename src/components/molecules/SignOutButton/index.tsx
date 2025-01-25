import { Toaster } from "solid-toast";
import Avatar from "~/components/atoms/Avatar";
import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { handleLogOut } from "~/api/auth";
import { auth } from "~/firebase";
import Button from "~/components/atoms/Button";

import styles from "./style.module.css";

// todo refactor with https://flowbite.com/docs/components/dropdowns/#user-avatar
export default function SignOutButton() {
	const user = auth.currentUser;
	const navigate = useNavigate();

	const [showDropdown, setShowDropdown] = createSignal(false);
	return (
		<Show when={user}>
			<div style="position: relative;">
				<Button
					id="user-button"
					tooltipContent="test tooltip" //todo fix tooltip
					styleClass="secondary"
					text="User menu"
					onClick={() => {
						console.debug(showDropdown());
						setShowDropdown(!showDropdown());
					}}
				/>
				{/*// <!-- Dropdown menu -->*/}
				<Show when={showDropdown()}>
					<div class={styles["dropdown-menu"]}>
						<ul class={styles["dropdown-list"]}>
							<li>
								<Button
									id="settings"
									tooltipContent="Settings" //todo fix tooltip
									styleClass="secondary"
									text="Settings"
									onClick={async () => {
										navigate("/auth/settings");
									}}
								/>
							</li>
							<li>
								<Button
									id="user-button"
									tooltipContent="test tooltip" //todo fix tooltip
									styleClass="secondary"
									text="Sign out"
									onClick={async () => {
										await handleLogOut();
										navigate("/auth/overview");
									}}
								/>
							</li>
						</ul>
					</div>
				</Show>
			</div>
			<Toaster />
		</Show>
	);
}
