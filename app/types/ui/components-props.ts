export interface InputBaseProps {
  label?: string;
  id: string;
  className?: string;
}

export interface TextInputProps extends InputBaseProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export type Option = {
  value: string;
  label: string;
};

export interface SliderProps extends InputBaseProps {
  min: number;
  max: number;
}
