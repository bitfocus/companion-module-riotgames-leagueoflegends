/**
 * Type guard for checking if a value is an Error
 */
declare function isError(value: unknown): value is Error

/**
 * Type guard for checking API response type
 */
declare function isRenderResponse(
	response: APIResponse,
): response is { type: 'render'; data: Render; responseTime: number }

/**
 * Type guard for checking API response type
 */
declare function isPlaybackResponse(
	response: APIResponse,
): response is { type: 'playback'; data: Playback; responseTime: number }