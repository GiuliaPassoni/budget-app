// IconSystem.tsx
import { Component, JSX } from "solid-js";
import {
	Activity,
	Apple,
	Baby,
	Backpack,
	Banana,
	Bath,
	Battery,
	Bed,
	Beer,
	BellRing,
	Bike,
	BookOpen,
	Briefcase,
	Bus,
	Calculator,
	Calendar,
	Camera,
	Car,
	Clock,
	Coffee,
	Compass,
	Cookie,
	CreditCard,
	Dog,
	DollarSign,
	Dumbbell,
	Fan,
	FileText,
	Film,
	Fish,
	Gamepad,
	Gift,
	Glasses,
	HandCoins,
	Headphones,
	Heart,
	Home,
	Hospital,
	Key,
	Lamp,
	Laptop,
	Lightbulb,
	Lock,
	Mail,
	Map,
	MapPin,
	MessageSquare,
	Monitor,
	Mouse,
	Music,
	Navigation,
	Newspaper,
	Package,
	Percent,
	Phone,
	PiggyBank,
	Pill,
	Pizza,
	Plane,
	Plug,
	Printer,
	Radio,
	Receipt,
	RollerCoaster,
	Sandwich,
	Scissors,
	Shirt,
	ShoppingBag,
	ShoppingBasket,
	ShoppingCart,
	Smartphone,
	Snowflake,
	Sofa,
	Stethoscope,
	Sun,
	Thermometer,
	Ticket,
	Train,
	TrendingDown,
	TrendingUp,
	Truck,
	Tv,
	Umbrella,
	UtensilsCrossed,
	Wallet,
	Watch,
	Weight,
	Wifi,
	Wine,
	Wrench,
} from "lucide-solid";

// Interface for icon props
export interface IconPropsI {
	style?: string;
	size?: number;
	color?: string;
}

// Type for the icon component
type IconComponent = Component<IconPropsI>;

// Type for the icon map
interface IconMapType {
	[key: string]: () => JSX.Element;
}

// Create a map of Lucide icons with proper typing
const lucideIcons: Record<string, IconComponent> = {
	// Food & Drinks
	coffee: Coffee,
	beer: Beer,
	wine: Wine,
	pizza: Pizza,
	sandwich: Sandwich,
	apple: Apple,
	cookie: Cookie,
	utensils: UtensilsCrossed,
	banana: Banana,
	fish: Fish,

	// Shopping & Retail
	shoppingbag: ShoppingBag,
	shoppingcart: ShoppingCart,
	shoppingbasket: ShoppingBasket,
	shirt: Shirt,
	scissors: Scissors,
	gift: Gift,
	package: Package,
	glasses: Glasses,
	watch: Watch,

	// Transportation
	car: Car,
	bus: Bus,
	train: Train,
	plane: Plane,
	bike: Bike,
	truck: Truck,
	navigation: Navigation,
	map: Map,
	compass: Compass,
	mappin: MapPin,

	// Home & Living
	home: Home,
	bed: Bed,
	sofa: Sofa,
	tv: Tv,
	lamp: Lamp,
	bath: Bath,
	thermometer: Thermometer,
	wrench: Wrench,

	// Finance & Money
	wallet: Wallet,
	creditcard: CreditCard,
	piggybank: PiggyBank,
	dollar: DollarSign,
	receipt: Receipt,
	calculator: Calculator,
	percent: Percent,
	trending_up: TrendingUp,
	trending_down: TrendingDown,

	// Health & Wellness
	heart: Heart,
	pill: Pill,
	stethoscope: Stethoscope,
	hospital: Hospital,
	dumbbell: Dumbbell,
	activity: Activity,
	weight: Weight,
	baby: Baby,
	dog: Dog,

	// Entertainment
	music: Music,
	headphones: Headphones,
	gamepad: Gamepad,
	film: Film,
	ticket: Ticket,
	book: BookOpen,
	newspaper: Newspaper,
	radio: Radio,
	rollercoaster: RollerCoaster,

	// Technology
	smartphone: Smartphone,
	laptop: Laptop,
	printer: Printer,
	wifi: Wifi,
	camera: Camera,
	battery: Battery,
	phone: Phone,
	monitor: Monitor,
	mouse: Mouse,

	// Services & Bills
	file: FileText,
	mail: Mail,
	message: MessageSquare,
	handcoins: HandCoins,
	key: Key,
	lock: Lock,
	bell: BellRing,
	plug: Plug,
	lightbulb: Lightbulb,

	// Misc Daily Expenses
	calendar: Calendar,
	clock: Clock,
	umbrella: Umbrella,
	briefcase: Briefcase,
	backpack: Backpack,
	snowflake: Snowflake,
	fan: Fan,
	sun: Sun,
};

// Import existing icons
const existingIcons = import.meta.glob(
	// const existingIcons = import.meta.glob<{ default: () => JSX.Element }>(
	"./*Icon.tsx",
	{
		eager: true,
		import: "default",
	},
);

// custom icons excluded from category icons
const EXCLUDED_ICONS = ["edit", "spinner", "close"];

// Create the combined iconMap with proper typing
export const iconMap: IconMapType = {
	// Add existing icons
	// Extract the icon name from the path (e.g., './MoonIcon.tsx' -> 'moon')
	...Object.entries(existingIcons).reduce<IconMapType>(
		(acc, [path, component]) => {
			const iconName = path
				.replace(/^\.\//, "") // Remove leading ./
				.replace(/Icon\.tsx$/, "") // Remove Icon.tsx suffix
				.toLowerCase(); // Convert to lowercase

			if (EXCLUDED_ICONS.includes(iconName)) {
				return acc;
			}
			return {
				...acc,
				[iconName]: component as () => JSX.Element,
			};
		},
		{},
	),

	// Add Lucide icons
	...Object.entries(lucideIcons).reduce<IconMapType>(
		(acc, [name, Component]) => {
			// Only add if there isn't already an icon with this name
			if (!acc[name]) {
				acc[name] = () => {
					const IconComp = Component as unknown as (
						props: IconPropsI,
					) => JSX.Element;
					return IconComp({
						size: 24,
						color: "white",
						strokeWidth: 2.5,
					});
				};
			}
			return acc;
		},
		{},
	),
};

export type IconName = keyof typeof iconMap;
export const iconKeys = Object.keys(iconMap);
