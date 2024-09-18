import { iconMap } from '~/components/atoms/icons/helpers';

export type TransactionType = 'expenses' | 'income' | 'investments';

export interface CategoryI {
  name: string;
  colour: string;
  iconName?: keyof typeof iconMap;
  type: TransactionType;
}
