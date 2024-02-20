import {
  InstanceBase,
  runEntrypoint,
  SomeCompanionConfigField,
  InstanceStatus,
} from '@companion-module/base'
import { Config, getConfigFields } from './config'
import { UpgradeScripts } from './upgrade'
import { Variables } from './variables'
import { Actions } from './actions'
import { ReplayService } from './http'
import {
  setIntervalAsync,
  clearIntervalAsync,
  SetIntervalAsyncTimer,
} from 'set-interval-async'

class LoLInstance extends InstanceBase<Config> {
  constructor(internal: unknown) {
    super(internal)
  }
  public config: Config = {
    host: '',
    apiPollingInterval: 250,
  }
  public apiInterval: SetIntervalAsyncTimer<unknown[]> | null = null
  public variables: Variables | null = null
  public actions: Actions | null = null
  public lolreplay: ReplayService | null = null

  public async init(config: Config): Promise<void> {
    this.config = config
    this.log('debug', `Process ID: ${process.pid}`)
    this.lolreplay = new ReplayService(this, config)
    this.variables = new Variables(this)
    this.actions = new Actions(this, this.lolreplay)
    this.updateInstance()
  }

  public async destroy(): Promise<void> {
    this.log('debug', 'destroy')
    if (this.apiInterval) clearIntervalAsync(this.apiInterval)
  }

  public async initializeInterval(): Promise<void> {
    const ipRegex = new RegExp(
      '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    )
    if (this.apiInterval) clearIntervalAsync(this.apiInterval)
    if (!ipRegex.test(this.config.host)) {
      this.updateStatus(InstanceStatus.BadConfig, 'Invalid IP')
      this.log(
        'error',
        `Invalid IP: ${this.config.host}, Test result: ${!ipRegex.test(this.config.host)}`,
      )
      return
    }
    this.log('debug', 'Connecting to LoL Replay API')
    this.apiInterval = setIntervalAsync(async () => {
      if (!this.lolreplay) {
        this.updateStatus(
          InstanceStatus.UnknownWarning,
          'Replay service not initialized',
        )
        this.apiInterval && clearIntervalAsync(this.apiInterval)
      } else {
        const renderData = await this.lolreplay.get('replay/render')
        if (renderData) this.variables?.UpdateVariable(renderData)
        const playbackData = await this.lolreplay.get('replay/playback')
        if (playbackData) this.variables?.UpdateVariable(playbackData)
      }
    }, this.config.apiPollingInterval)
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
    this.initializeInterval()
    return
  }
}

export = LoLInstance

runEntrypoint(LoLInstance, UpgradeScripts)
