/**
 * Result type for error handling - represents either success with data or failure with error
 */
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E }

/**
 * Error codes as a union type for type safety
 */
type ErrorCode = 'INVALID_IP' | 'INVALID_PORT' | 'CONNECTION_TIMEOUT' | 'API_ERROR' | 'PARSE_ERROR'

/**
 * Base error interface for structured errors
 */
interface IError {
	code: ErrorCode
	message: string
	cause?: Error
}