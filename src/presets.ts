import LoLInstance from './'
import { CompanionButtonPresetDefinition, combineRgb } from '@companion-module/base'
import { renderInstance, playbackInstance } from './data'
import { prettyfyStr, camelCaseToSnakeCase } from './utils'

export class Presets {
	private readonly instance: LoLInstance
	public presets: { [id: string]: CompanionButtonPresetDefinition | undefined } = {}

	constructor(instance: LoLInstance) {
		this.instance = instance
		this.createPreset('Render', renderInstance)
		this.createPreset('Playback', playbackInstance)
		this.instance.setPresetDefinitions(this.presets)
		this.instance.log('info', `Presets loaded: ${Object.keys(this.presets).length}`)
	}

	private createPreset(category: string, origin: typeof renderInstance | typeof playbackInstance): void {
		for (const [key, value] of Object.entries(origin)) {
			if (typeof value !== 'boolean' || value === null) continue
			this.presets[key] = {
				type: 'button',
				category: category,
				name: `Toggle ${prettyfyStr(key)}`,
				style: {
					text: prettyfyStr(key),
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: camelCaseToSnakeCase(key),
								options: { value: 'toggle' },
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}
	}
}
