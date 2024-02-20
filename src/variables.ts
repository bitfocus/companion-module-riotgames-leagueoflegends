import LoLInstance from './'
import type { CompanionVariableDefinition } from '@companion-module/base'
import { renderInstance, playbackInstance } from './data'
import { prettyfyStr } from './utils'

export class Variables {
  private readonly instance: LoLInstance
  public variables: CompanionVariableDefinition[] = []

  constructor(instance: LoLInstance) {
    this.instance = instance
    const replayAPIKeys: string[] = []

    function iterateKeys(obj: any, parentKey = '') {
      Object.keys(obj).forEach(key => {
        const newKey = parentKey ? `${parentKey}.${key}` : key
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          iterateKeys(obj[key], newKey)
        } else {
          replayAPIKeys.push(newKey)
        }
      })
    }
    iterateKeys(renderInstance)
    iterateKeys(playbackInstance)

    this.variables = replayAPIKeys.map(key => ({
      variableId: key,
      name: prettyfyStr(key),
    }))
  }

  UpdateVariableDefinitions(): void {
    this.instance.setVariableDefinitions(this.variables)
  }

  UpdateVariable(data: Render | Playback): void {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        Object.keys(value).forEach(subKey => {
          this.instance.setVariableValues({
            [`${key}.${subKey}`]: value[subKey],
          })
        })
      } else {
        this.instance.setVariableValues({ [key]: value })
      }
    }
  }
}
