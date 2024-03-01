import LoLInstance from './'
import { renderInstance, playbackInstance } from './data'
import type { CompanionActionDefinitions, SomeCompanionActionInputField } from '@companion-module/base'
import { camelCaseToSnakeCase, prettyfyStr } from './utils'

export class Actions {
	private readonly instance: LoLInstance
	public actions: CompanionActionDefinitions = {}

	constructor(instance: LoLInstance) {
		this.instance = instance
		this.createRenderActions()
		this.createPlaybackActions()
	}

	private createOptions(type: string, value: string | number | boolean): SomeCompanionActionInputField[] {
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

	private createAction(
		key: string,
		value: string | number | boolean,
		endpoint: 'replay/render' | 'replay/playback',
	): void {
		const actionId = camelCaseToSnakeCase(key)
		const options = this.createOptions(typeof value, value)
		const name = prettyfyStr(key).replace(' Attached', '').replace(' Enabled', '')
		this.actions[actionId] = {
			name: typeof value === 'boolean' ? `Toggle/On/Off ${name}` : `Set ${name}`,
			options,
			callback: async ({ options }) => {
				if (options.value === 'toggle') {
					const currentValue = this.instance.getVariableValue(key)
					this.instance.lolreplay?.post(endpoint, {
						[key]: currentValue ? 'false' : 'true',
					})
				} else {
					await this.instance.lolreplay?.post(endpoint, {
						[key]: options.value as string,
					})
				}
			},
		}
	}

	private createRenderActions(): void {
		for (const [key, value] of Object.entries(renderInstance)) {
			this.createAction(key, value, 'replay/render')
		}
	}

	private createPlaybackActions(): void {
		for (const [key, value] of Object.entries(playbackInstance)) {
			this.createAction(key, value, 'replay/playback')
		}
	}

	UpdateActionDefinitions(): void {
		this.instance.setActionDefinitions(this.actions)
	}
}
