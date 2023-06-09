import { SelectProps } from '@mui/material/Select';

export interface SelectItem {
  value: string | number;
  label?: string;
}

export type SelectComponentProps = SelectProps & {
  selectItems: SelectItem[];
  label: string;
};
