import { $ZodIssue } from 'zod/v4/core';

export type ValidationIssue = $ZodIssue;

export default interface ErrorResponse {
  status: number;
  message: string;
  issues: ValidationIssue[];
}
