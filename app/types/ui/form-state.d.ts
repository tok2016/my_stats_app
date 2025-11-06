export default interface FormState<FormDataType> {
  error: boolean;
  message: string;
  issues?: Record<keyof FormDataType, string>;
  data?: FormData;
}

export type FormAction<DataType> = (
  state: FormState<DataType>,
  formData: FormData
) => Promise<FormState<DataType>>;
