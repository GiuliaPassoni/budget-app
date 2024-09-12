import StarIcon from '~/components/atoms/icons/StarIcon';
import MoonIcon from '~/components/atoms/icons/MoonIcon';
import SunIcon from '~/components/atoms/icons/SunIcon';
import Card from '~/components/atoms/Card';
import CardWithIcon from '~/components/molecules/CardWithIcon';

export default function CategoriesComponent() {
  return (
    <>
      <div class="grid grid-cols-3 md:grid-cols-3 gap-4">
        <Card>Tab with income categories</Card>
        <Card>Tab with expense categories</Card>
        <Card>Tab with investing categories</Card>
        <CardWithIcon icon={<StarIcon />} title="Star income" />
        <CardWithIcon icon={<MoonIcon />} title="Moon income" />
        <CardWithIcon icon={<SunIcon />} title="Sun income" />
      </div>
    </>
  );
}
