import LoLInstance from './'
import { CompanionFeedbackDefinitions } from '@companion-module/base'
import { renderInstance, playbackInstance } from './data'
import { prettyfyStr } from './utils'
import { combineRgb } from '@companion-module/base'

export class Feedbacks {
	private readonly instance: LoLInstance
	public feedbacks: CompanionFeedbackDefinitions = {}

	constructor(instance: LoLInstance) {
		this.instance = instance
		this.createRenderFeedbacks()
		this.createPlaybackFeedbacks()
	}

	private createRenderFeedbacks(): void {
		const renderFeedbacks: CompanionFeedbackDefinitions = {}
		Object.keys(renderInstance).forEach((key) => {
			if (typeof renderInstance[key as keyof Render] !== 'boolean') return
			renderFeedbacks[key] = {
				name: `${prettyfyStr(key)} Status`,
				type: 'boolean',
				description: `Indicates whether ${prettyfyStr(key)} is active`,
				options: [],
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(255, 255, 255),
				},
				callback: async (): Promise<boolean> => {
					if (this.instance.config.apiPollingInterval === 0) {
						return this.getRenderData(key as keyof Render)
					} else {
						return this.instance.data?.render[key as keyof Render] as boolean
					}
				},
			}
		})
		this.feedbacks = { ...this.feedbacks, ...renderFeedbacks }
	}

	private createPlaybackFeedbacks(): void {
		const playbackFeedbacks: CompanionFeedbackDefinitions = {}
		Object.keys(playbackInstance).forEach((key) => {
			if (typeof playbackInstance[key as keyof Playback] !== 'boolean') return
			playbackFeedbacks[key] = {
				name: `${prettyfyStr(key)} Status`,
				type: 'boolean',
				description: `Indicates whether ${prettyfyStr(key)} is active`,
				options: [],
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(255, 255, 255),
				},
				callback: async (): Promise<boolean> => {
					if (this.instance.config.apiPollingInterval === 0) {
						return this.getPlaybackData(key as keyof Playback)
					} else {
						return this.instance.data?.playback[key as keyof Playback] as boolean
					}
				},
			}
		})
		this.feedbacks = { ...this.feedbacks, ...playbackFeedbacks }
	}

	private async getRenderData(key: keyof Render): Promise<boolean> {
		const newData = this.instance.lolreplay?.get('replay/render') as unknown as Render
		if (newData) {
			const data = newData[key]
			if (data && typeof data === 'boolean') return data
		}
		return false
	}

	private async getPlaybackData(key: keyof Playback): Promise<boolean> {
		const newData = this.instance.lolreplay?.get('replay/playback') as unknown as Playback
		if (newData) {
			const data = newData[key]
			if (data && typeof data === 'boolean') return data
		}
		return false
	}

	UpdateFeedbackDefinitions() {
		this.instance.setFeedbackDefinitions(this.feedbacks)
	}
}
