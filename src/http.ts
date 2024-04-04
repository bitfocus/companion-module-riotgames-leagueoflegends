import LoLInstance from './'
import https from 'node:https'
import http from 'node:http'
import { InstanceStatus } from '@companion-module/base'
import { convertObjectValues } from './utils'

export class ReplayService {
	private instance: LoLInstance
	private ip: string
	private port: number
	private request: typeof https | typeof http
	constructor(instance: LoLInstance) {
		this.ip = instance.config.host
		this.port = instance.config.port
		this.request = instance.config.ssl ? https : http
		this.instance = instance
	}

	async get(path: ReplayAPIPaths): Promise<Render | Playback | void> {
		const options = {
			hostname: this.ip,
			port: this.port,
			path: '/' + path,
			rejectUnauthorized: false,
			headers: { 'Content-Type': 'application/json' },
			timeout: 5000,
		}
		return new Promise((resolve, reject) => {
			let all_data = ''
			const startTime = Date.now() // Record the start time
			// this.instance.log('debug', `Sending request to ${options.hostname}:${options.port}${options.path}`)
			const req = this.request.get(options, (res) => {
				res.setEncoding('utf8')
				res.on('data', (d) => {
					all_data += d
				})
				res.on('error', (e) => {
					this.instance.log('error', e.message)
					this.instance.updateStatus(InstanceStatus.UnknownError, e.message)
					reject()
				})
				res.on('end', () => {
					const responseTime = (Date.now() - startTime) / 1000 // Calculate the response time in seconds
					// this.instance.log('info', `Response time: ${responseTime} ms`) // Log the response time
					this.instance.updateStatus(InstanceStatus.Ok, 'Connected')
					const newData = JSON.parse(all_data.slice(0, -1) + `,"responseTime":${responseTime}}`)
					this.instance.data?.update(newData)
					resolve(newData as Render | Playback)
				})
			})
			req.on('error', (e) => {
				this.instance.log('error', e.message)
				this.instance.updateStatus(InstanceStatus.UnknownError, e.message)
				reject()
			})
			req.on('timeout', () => {
				this.instance.log('error', 'Request timeout')
				this.instance.updateStatus(InstanceStatus.ConnectionFailure, 'Request timeout')
				reject()
			})
			req.end()
		})
	}

	async post(path: ReplayAPIPaths, data: Record<string, string>): Promise<Render | Playback | void> {
		const body = JSON.stringify(convertObjectValues(data))
		const options = {
			hostname: this.ip,
			port: this.port,
			path: '/' + path,
			rejectUnauthorized: false,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': body.length,
			},
		}
		return new Promise((resolve, reject) => {
			let all_data = ''
			const req = this.request.request(options, (res) => {
				res.setEncoding('utf8')
				res.on('data', (d) => {
					all_data += d
				})

				res.on('end', () => {
					// this.instance.log('debug', `received data from post: ${all_data}`)
					const newData = JSON.parse(all_data)
					this.instance.variables?.UpdateVariable(newData)
					resolve(newData as Render | Playback)
				})
			})
			req.on('error', (e) => {
				this.instance.log('error', e.message)
				this.instance.updateStatus(InstanceStatus.UnknownError, e.message)
				reject()
			})
			req.write(body)
			req.end()
		})
	}
}
