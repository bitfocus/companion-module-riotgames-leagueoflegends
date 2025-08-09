/**
 * Branded type for validated IP addresses
 */
type ValidatedIP = string & { __brand: 'ValidatedIP' }

/**
 * Branded type for validated port numbers
 */
type ValidatedPort = number & { __brand: 'ValidatedPort' }

/**
 * Configuration interface with validated types
 */
interface IConfig {
	host: ValidatedIP
	port: ValidatedPort
	apiPollingInterval: number
	ssl: boolean
}