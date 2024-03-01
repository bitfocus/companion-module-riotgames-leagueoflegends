import { InstanceBase, runEntrypoint, SomeCompanionConfigField, InstanceStatus } from '@companion-module/base'
import { Config, getConfigFields } from './config'
import { UpgradeScripts } from './upgrade'
import { Variables } from './variables'
import { Actions } from './actions'
import { ReplayService } from './http'
import { setIntervalAsync, clearIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async'

class LoLInstance extends InstanceBase<Config> {
	constructor(internal: unknown) {
		super(internal)
	}
	public config: Config = {
		host: '',
		apiPollingInterval: 250,
		port: 2999,
		ssl: true,
	}
	public apiInterval: SetIntervalAsyncTimer<unknown[]> | null = null
	public variables: Variables | null = null
	public actions: Actions | null = null
	public lolreplay: ReplayService | null = null

	public async init(config: Config): Promise<void> {
		this.config = config
		this.log('debug', `Process ID: ${process.pid}`)
		this.lolreplay = new ReplayService(this)
		this.variables = new Variables(this)
		this.actions = new Actions(this)
		this.updateInstance()
	}

	public async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		if (this.apiInterval) clearIntervalAsync(this.apiInterval)
	}

	public async initializeInterval(): Promise<void> {
		this.apiInterval = setIntervalAsync(async () => {
			await this.connectAPI()
		}, this.config.apiPollingInterval)
	}

	private isValidIP(ip: string): boolean {
		const ipRegex = new RegExp(
			'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
		)
		return ipRegex.test(ip)
	}

	private async fetchData(path: 'replay/render' | 'replay/playback'): Promise<void> {
		await this.lolreplay!.get(path)
	}

	async connectAPI(): Promise<void> {
		if (!this.lolreplay) {
			this.updateStatus(InstanceStatus.UnknownWarning, 'Replay service not initialized')
			this.apiInterval && clearIntervalAsync(this.apiInterval)
		} else {
			await this.fetchData('replay/render')
			await this.fetchData('replay/playback')
		}
	}

	/**
	 * @param config new configuration data
	 * @description triggered every time the config for this instance is saved
	 */
	public async configUpdated(config: Config): Promise<void> {
		this.config = config
		this.updateInstance()
	}

	public getConfigFields(): SomeCompanionConfigField[] {
		return getConfigFields()
	}

	private updateInstance(): void {
		this.variables?.UpdateVariableDefinitions()
		this.actions?.UpdateActionDefinitions()

		if (this.apiInterval) clearIntervalAsync(this.apiInterval)
		if (!this.isValidIP(this.config.host)) {
			this.updateStatus(InstanceStatus.BadConfig, 'Invalid IP')
			return
		}
		this.log('debug', 'Connecting to LoL Replay API')
		if (
			!this.config.apiPollingInterval ||
			this.config.apiPollingInterval === 0 ||
			this.config.apiPollingInterval < 100
		) {
			this.connectAPI()
		} else this.initializeInterval()
	}
}

export = LoLInstance

runEntrypoint(LoLInstance, UpgradeScripts)
