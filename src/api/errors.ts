import { ValidationErrorItem } from '../types';

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: ValidationErrorItem[];
  public timestamp: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR',
    details?: ValidationErrorItem[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'UNEXPECTED_ERROR');
  }

  return new ApiError('Ocorreu um erro desconhecido no servidor.', 500, 'UNKNOWN_ERROR');
}
