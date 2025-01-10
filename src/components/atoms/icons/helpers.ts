import { JSX } from "solid-js";
import MoonIcon from "~/components/atoms/icons/MoonIcon";
import SunIcon from "~/components/atoms/icons/SunIcon";
import StarIcon from "~/components/atoms/icons/StarIcon";
import PlusIcon from "~/components/atoms/icons/PlusIcon";
import EditIcon from "~/components/atoms/icons/EditIcon";

export const iconMap: { [key: string]: () => JSX.Element } = {
	moon: MoonIcon,
	sun: SunIcon,
	star: StarIcon,
	plus: PlusIcon,
	edit: EditIcon,
};
