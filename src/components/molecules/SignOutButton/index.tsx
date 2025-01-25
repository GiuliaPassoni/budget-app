import { Toaster } from "solid-toast";
import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { handleLogOut } from "~/api/auth";
import { auth } from "~/firebase";
import Button from "~/components/atoms/Button";

import styles from "./style.module.css";
import AvatarIcon from "~/components/atoms/icons/AvatarIcon";

// todo refactor with https://flowbite.com/docs/components/dropdowns/#user-avatar
export default function SignOutButton() {
	const user = auth.currentUser;
	const navigate = useNavigate();

	const [showDropdown, setShowDropdown] = createSignal(false);
	return (
		<Show when={user}>
			<div class={styles.userMenuContainer}>
				<Button
					id="user-button"
					tooltipContent="test tooltip" //todo fix tooltip
					styleClass="secondary w-32 py-3"
					text="User menu"
					onClick={() => {
						setShowDropdown(!showDropdown());
					}}
					leftIcon={<AvatarIcon />}
				/>
				{/*// <!-- Dropdown menu -->*/}
				<Show when={showDropdown()}>
					<div class={styles.dropdownMenu}>
						<ul class={styles.dropdownList}>
							<li>
								<Button
									id="settings"
									tooltipContent="Settings" //todo fix tooltip
									styleClass="transparent"
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
									styleClass="transparent"
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
