export default interface FormState<FormDataType> {
  error: boolean;
  message: string;
  issues?: Record<keyof FormDataType, string>;
  data?: FormData;
}
