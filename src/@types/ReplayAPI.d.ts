interface Render {
  banners: boolean
  cameraAttached: boolean
  cameraLookSpeed: number
  cameraMode: string
  cameraMoveSpeed: number
  cameraPosition: CameraPosition
  cameraRotation: CameraRotation
  characters: boolean
  depthFogColor: DepthFogColor
  depthFogEnabled: boolean
  depthFogEnd: number
  depthFogIntensity: number
  depthFogStart: number
  depthOfFieldCircle: number
  depthOfFieldDebug: boolean
  depthOfFieldEnabled: boolean
  depthOfFieldFar: number
  depthOfFieldMid: number
  depthOfFieldNear: number
  depthOfFieldWidth: number
  environment: boolean
  farClip: number
  fieldOfView: number
  floatingText: boolean
  fogOfWar: boolean
  healthBarChampions: boolean
  healthBarMinions: boolean
  healthBarPets: boolean
  healthBarStructures: boolean
  healthBarWards: boolean
  heightFogColor: HeightFogColor
  heightFogEnabled: boolean
  heightFogEnd: number
  heightFogIntensity: number
  heightFogStart: number
  interfaceAll: boolean
  interfaceAnnounce: boolean
  interfaceChat: boolean
  interfaceFrames: boolean
  interfaceKillCallouts: boolean
  interfaceMinimap: boolean
  interfaceNeutralTimers: boolean
  interfaceQuests: null
  interfaceReplay: boolean
  interfaceScore: boolean
  interfaceScoreboard: boolean
  interfaceTarget: boolean
  interfaceTimeline: boolean
  navGridOffset: number
  nearClip: number
  outlineHover: boolean
  outlineSelect: boolean
  particles: boolean
  selectionName: string
  selectionOffset: SelectionOffset
  skyboxOffset: number
  skyboxPath: string
  skyboxRadius: number
  skyboxRotation: number
  sunDirection: SunDirection
}

interface Playback {
  length: number
  paused: boolean
  seeking: boolean
  speed: number
  time: number
}

interface CameraPosition {
  x: number
  y: number
  z: number
}

interface CameraRotation {
  x: number
  y: number
  z: number
}

interface DepthFogColor {
  a: number
  b: number
  g: number
  r: number
}

interface HeightFogColor {
  a: number
  b: number
  g: number
  r: number
}

interface SelectionOffset {
  x: number
  y: number
  z: number
}

interface SunDirection {
  x: number
  y: number
  z: number
}
