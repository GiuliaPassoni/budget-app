import "./style.css";

export default function Footer() {
	// todo fix to bottom of page
	return (
		<footer>
			<div>
				<span class="left">
					© 2024{" "}
					<a href="https://giuliapassoni.netlify.app" class="hover:underline">
						Giulia
					</a>
				</span>
				<ul class="right">
					<li>
						<a href="#" class="hover:underline me-4 md:me-6">
							About(#TODO)
						</a>
					</li>
					<li>
						<a href="#" class="hover:underline">
							Contact(#TODO)
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
}
