import { JSX } from 'solid-js';
import MoonIcon from '~/components/atoms/icons/MoonIcon';
import SunIcon from '~/components/atoms/icons/SunIcon';
import StarIcon from '~/components/atoms/icons/StarIcon';

export const iconMap: { [key: string]: () => JSX.Element } = {
  moon: MoonIcon,
  sun: SunIcon,
  star: StarIcon,
};
