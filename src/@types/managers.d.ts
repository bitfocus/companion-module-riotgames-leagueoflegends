import {
  CompanionActionDefinitions,
  CompanionFeedbackDefinitions,
  CompanionVariableDefinition,
  InstanceStatus
} from '@companion-module/base'

/**
 * Logger interface for structured logging across the application
 */
interface ILogger {
  /**
   * Log a debug message
   * @param message - The message to log
   */
  debug(message: string): void

  /**
   * Log an informational message
   * @param message - The message to log
   */
  info(message: string): void

  /**
   * Log a warning message
   * @param message - The message to log
   */
  warn(message: string): void

  /**
   * Log an error message
   * @param message - The message to log
   * @param error - Optional error object to include
   */
  error(message: string, error?: Error): void
}

/**
 * Status management interface for handling instance status updates
 */
interface IStatusManager {
  /**
   * Update the instance status
   * @param status - The new status
   * @param message - Optional status message
   */
  updateStatus(status: InstanceStatus, message?: string): void

  /**
   * Get the current instance status
   * @returns The current status
   */
  getStatus(): InstanceStatus
}

/**
 * Variable management interface for handling Companion variables
 */
interface IVariableManager {
  /**
   * Set multiple variable values at once
   * @param values - Record of variable names to values
   */
  setVariableValues(values: Record<string, any>): void

  /**
   * Get a single variable value
   * @param key - The variable key to retrieve
   * @returns The variable value
   */
  getVariableValue(key: string): any

  /**
   * Set the variable definitions
   * @param definitions - Array of variable definitions
   */
  setVariableDefinitions(definitions: CompanionVariableDefinition[]): void
}

/**
 * Feedback management interface for handling Companion feedbacks
 */
interface IFeedbackManager {
  /**
   * Check feedbacks by key
   * @param key - The feedback key to check
   */
  checkFeedbacks(key: string): void

  /**
   * Set the feedback definitions
   * @param feedbacks - Feedback definitions object
   */
  setFeedbackDefinitions(feedbacks: CompanionFeedbackDefinitions): void
}

/**
 * Action management interface for handling Companion actions
 */
interface IActionManager {
  /**
   * Set the action definitions
   * @param actions - Action definitions object
   */
  setActionDefinitions(actions: CompanionActionDefinitions): void
}