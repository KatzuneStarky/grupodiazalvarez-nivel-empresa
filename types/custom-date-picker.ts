import { FieldValues, Path } from "react-hook-form";

export interface DatePickerProps {
  startYear?: number
  endYear?: number
}

export interface CustomDatePickerProps<T extends FieldValues> extends DatePickerProps {
  name: Path<T>;
  label: string;
  disabled?: boolean;
  className?: string
  defaultToNow?: boolean
}