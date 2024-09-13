export type TransactionType = 'expenses' | 'income' | 'investments';

export interface CategoryI {
  name: string;
  colour: string;
  iconName?: string;
  type: TransactionType;
}
