// the component itself can't have the same name as the bootstrap <Navbar> component
export default function NavBar() {
	return (
		<nav class="bg-white border-gray-200 dark:bg-gray-900">
			<div class="flex flex-wrap items-center justify-between mx-auto p-0">
				<div
					class="items-center min-w-full justify-between hidden w-full md:flex md:w-auto md:order-1"
					id="navbar-user"
				>
					<ul class="flex flex-col font-medium p-4 md:p-0 w-full rounded-lg bg-blue-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 2xl:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
						<li>
							<a
								href="/#"
								class="block py-2 px-3 text-blue bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
								aria-current="page"
							>
								Home
							</a>
						</li>
						<li>
							<a
								href="/overview"
								class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Overview
							</a>
						</li>
						<li>
							<a
								href="#"
								class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Help
							</a>
						</li>
						<li class="hidden lg:flex lg:flex-1 lg:justify-end">
							<a
								href="/login"
								class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
							>
								Log in <span aria-hidden="true">&rarr;</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
