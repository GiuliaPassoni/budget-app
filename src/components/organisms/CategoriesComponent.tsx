import BaseCard from "~/components/baseComponents/BaseCard";
import CardWithIcon from "~/components/atoms/CardWithIcon";
import StarIcon from "~/components/atoms/icons/StarIcon";
import MoonIcon from "~/components/atoms/icons/MoonIcon";
import SunIcon from "~/components/atoms/icons/SunIcon";

export default function CategoriesComponent() {
	return (
		<>
			<div class="grid grid-cols-3 md:grid-cols-3 gap-4">
				<BaseCard>Tab with income categories</BaseCard>
				<BaseCard>Tab with expense categories</BaseCard>
				<BaseCard>Tab with investing categories</BaseCard>
				<CardWithIcon icon={<StarIcon />} title="Star income" />
				<CardWithIcon icon={<MoonIcon />} title="Moon income" />
				<CardWithIcon icon={<SunIcon />} title="Sun income" />
			</div>
		</>
	);
}
