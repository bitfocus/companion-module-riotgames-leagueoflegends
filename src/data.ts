import { EventEmitter } from 'events'
import LoLInstance from './'

export const renderInstance: Render = {
	banners: false,
	cameraAttached: false,
	cameraLookSpeed: 0,
	cameraMode: '',
	cameraMoveSpeed: 0,
	cameraPosition: {
		x: 0,
		y: 0,
		z: 0,
	},
	cameraRotation: {
		x: 0,
		y: 0,
		z: 0,
	},
	characters: false,
	depthFogColor: {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
	},
	depthFogEnabled: false,
	depthFogEnd: 0,
	depthFogIntensity: 0,
	depthFogStart: 0,
	depthOfFieldCircle: 0,
	depthOfFieldDebug: false,
	depthOfFieldEnabled: false,
	depthOfFieldFar: 0,
	depthOfFieldMid: 0,
	depthOfFieldNear: 0,
	depthOfFieldWidth: 0,
	environment: false,
	farClip: 0,
	fieldOfView: 0,
	floatingText: false,
	fogOfWar: false,
	healthBarChampions: false,
	healthBarMinions: false,
	healthBarPets: false,
	healthBarStructures: false,
	healthBarWards: false,
	heightFogColor: {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
	},
	heightFogEnabled: false,
	heightFogEnd: 0,
	heightFogIntensity: 0,
	heightFogStart: 0,
	interfaceAll: false,
	interfaceAnnounce: false,
	interfaceChat: false,
	interfaceFrames: false,
	interfaceKillCallouts: false,
	interfaceMinimap: false,
	interfaceNeutralTimers: false,
	interfaceQuests: null,
	interfaceReplay: false,
	interfaceScore: false,
	interfaceScoreboard: false,
	interfaceTarget: false,
	interfaceTimeline: false,
	navGridOffset: 0,
	nearClip: 0,
	outlineHover: false,
	outlineSelect: false,
	particles: false,
	selectionName: '',
	selectionOffset: {
		x: 0,
		y: 0,
		z: 0,
	},
	skyboxOffset: 0,
	skyboxPath: '',
	skyboxRadius: 0,
	skyboxRotation: 0,
	sunDirection: {
		x: 0,
		y: 0,
		z: 0,
	},
}

export const playbackInstance: Playback = {
	length: 0,
	paused: false,
	seeking: false,
	speed: 1.0,
	time: 0,
}

export class Data extends EventEmitter {
	private readonly instance: LoLInstance
	public render: Render = renderInstance
	public playback: Playback = playbackInstance

	constructor(instance: LoLInstance) {
		super()
		this.instance = instance
	}

	public update = (data: Render | Playback): void => {
		if ('length' in data) {
			this.playback = data
		} else {
			this.render = data
		}
		this.instance.variables?.UpdateVariable(data)
		for (const [key, _value] of Object.entries(data)) {
			this.instance.checkFeedbacks(key as keyof Playback | keyof Render)
		}
	}
}
