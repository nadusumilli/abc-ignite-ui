// Error codes and user-friendly messages
export const ERROR_CODES = {
  // Class errors
  CLASS_PAST_DATE: 'CLASS_PAST_DATE',
  CLASS_INVALID_DATE_RANGE: 'CLASS_INVALID_DATE_RANGE',
  CLASS_NOT_FOUND: 'CLASS_NOT_FOUND',
  CLASS_INVALID_ID: 'CLASS_INVALID_ID',
  CLASS_ALREADY_EXISTS: 'CLASS_ALREADY_EXISTS',
  CLASS_OVERLAP: 'CLASS_OVERLAP',
  
  // Booking errors
  BOOKING_PAST_DATE: 'BOOKING_PAST_DATE',
  BOOKING_NOT_FOUND: 'BOOKING_NOT_FOUND',
  BOOKING_INVALID_ID: 'BOOKING_INVALID_ID',
  BOOKING_INVALID_STATUS_TRANSITION: 'BOOKING_INVALID_STATUS_TRANSITION',
  BOOKING_DATE_OUT_OF_RANGE: 'BOOKING_DATE_OUT_OF_RANGE',
  BOOKING_CLASS_FULL: 'BOOKING_CLASS_FULL',
  
  // General errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
} as const;

// User-friendly error messages
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.CLASS_PAST_DATE]: 'Start date must be from tomorrow onwards.',
  [ERROR_CODES.CLASS_INVALID_DATE_RANGE]: 'Start date must be before end date. Please check your date selection.',
  [ERROR_CODES.CLASS_NOT_FOUND]: 'Class not found. Please refresh the page and try again.',
  [ERROR_CODES.CLASS_INVALID_ID]: 'Invalid class information. Please refresh the page and try again.',
  [ERROR_CODES.CLASS_ALREADY_EXISTS]: 'A class with this name already exists in the specified date range.',
  [ERROR_CODES.CLASS_OVERLAP]: 'This class schedule overlaps with existing classes. Please choose different dates.',
  
  [ERROR_CODES.BOOKING_PAST_DATE]: 'Participation date must be from tomorrow onwards.',
  [ERROR_CODES.BOOKING_NOT_FOUND]: 'Booking not found. Please refresh the page and try again.',
  [ERROR_CODES.BOOKING_INVALID_ID]: 'Invalid booking information. Please refresh the page and try again.',
  [ERROR_CODES.BOOKING_INVALID_STATUS_TRANSITION]: 'Cannot change booking status in this way. Please select a valid status.',
  [ERROR_CODES.BOOKING_DATE_OUT_OF_RANGE]: 'Participation date must be within the class schedule. Please check the class dates.',
  [ERROR_CODES.BOOKING_CLASS_FULL]: 'This class is already at maximum capacity.',
  
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Something went wrong. Please try again later.',
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
};

// Helper function to get user-friendly error message
export const getErrorMessage = (errorCode: string, fallbackMessage?: string): string => {
  return ERROR_MESSAGES[errorCode] || fallbackMessage || ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR];
};

// Helper function to extract error code from API response
export const extractErrorCode = (error: any): string => {
  return error.response?.data?.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
}; 