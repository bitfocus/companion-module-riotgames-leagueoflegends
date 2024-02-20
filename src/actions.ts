import LoLInstance from './'
import { renderInstance, playbackInstance } from './data'
import type {
  CompanionActionDefinitions,
  SomeCompanionActionInputField,
} from '@companion-module/base'
import { camelCaseToSnakeCase, prettyfyStr } from './utils'
import { ReplayService } from './http'

export class Actions {
  private readonly instance: LoLInstance
  public actions: CompanionActionDefinitions = {}
  private replayapi: ReplayService

  constructor(instance: LoLInstance, api: ReplayService) {
    this.instance = instance
    this.replayapi = api

    this.createRenderActions()
  }

  createOptions(
    type: string,
    value: string | number | boolean,
  ): SomeCompanionActionInputField[] {
    switch (type) {
      case 'number':
        return [
          {
            type: 'number',
            id: 'value',
            label: 'Value',
            default: value as number,
            min: -100000,
            max: 100000,
          },
        ]
      case 'string':
        return [
          {
            type: 'textinput',
            id: 'value',
            label: 'Value',
            default: value as string,
          },
        ]
      case 'boolean':
        return [
          {
            type: 'dropdown',
            id: 'value',
            label: 'Value',
            default: `${value}`,
            choices: [
              { id: 'true', label: 'On' },
              { id: 'false', label: 'Off' },
              { id: 'toggle', label: 'Toggle' },
            ],
          },
        ]
      default:
        return []
    }
  }

  createAction(
    key: string,
    value: string | number | boolean,
    endpoint: 'replay/render' | 'replay/playback',
  ): void {
    const actionId = camelCaseToSnakeCase(key)
    const options = this.createOptions(typeof value, value)
    this.actions[actionId] = {
      name: `Set ${prettyfyStr(key)}`,
      options,
      callback: ({ options }) => {
        if (options.value === 'toggle') {
          const currentValue = this.instance.getVariableValue(key)
          this.replayapi.post(endpoint, {
            [key]: currentValue === 'true' ? 'false' : 'true',
          })
          return
        }
        this.replayapi.post(endpoint, {
          [key]: options.value as string,
        })
      },
    }
  }

  createRenderActions(): void {
    for (const [key, value] of Object.entries(renderInstance)) {
      this.createAction(key, value, 'replay/render')
    }
  }

  createPlaybackActions(): void {
    for (const [key, value] of Object.entries(playbackInstance)) {
      this.createAction(key, value, 'replay/playback')
    }
  }

  UpdateActionDefinitions(): void {
    this.instance.setActionDefinitions(this.actions)
  }
}
