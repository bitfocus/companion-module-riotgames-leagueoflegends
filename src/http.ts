import { Config } from './config'
import LoLInstance from './'
import https from 'node:https'
import { InstanceStatus } from '@companion-module/base'
import { convertObjectValues } from './utils'

type ReplayAPIPaths = 'replay/playback' | 'replay/render'
export class ReplayService {
  private instance: LoLInstance
  private ip: string
  constructor(instance: LoLInstance, config: Config) {
    this.ip = config.host
    this.instance = instance
  }

  async get(path: ReplayAPIPaths): Promise<Render | Playback | void> {
    const options = {
      hostname: this.ip,
      port: 2999,
      path: '/' + path,
      rejectUnauthorized: false,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    }
    return new Promise((resolve, reject) => {
      let all_data = ''
      const req = https.get(options, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          all_data += d
        })
        res.on('error', e => {
          this.instance.log('error', e.message)
          this.instance.updateStatus(InstanceStatus.UnknownError, e.message)
          reject()
        })
        res.on('end', () => {
          this.instance.updateStatus(InstanceStatus.Ok, 'Connected')
          resolve(JSON.parse(all_data))
        })
      })
      req.on('error', e => {
        this.instance.log('error', e.message)
        this.instance.updateStatus(InstanceStatus.UnknownError, e.message)
        reject()
      })
      req.on('timeout', () => {
        this.instance.log('error', 'Request timeout')
        this.instance.updateStatus(
          InstanceStatus.ConnectionFailure,
          'Request timeout',
        )
        reject()
      })
      req.end()
    })
  }

  async post(
    path: ReplayAPIPaths,
    data: Record<string, string>,
  ): Promise<Render | Playback | void> {
    const body = JSON.stringify(convertObjectValues(data))
    const options = {
      hostname: this.ip,
      port: 2999,
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
      const req = https.request(options, res => {
        res.setEncoding('utf8')
        res.on('data', d => {
          all_data += d
        })

        res.on('end', () => {
          // this.instance.log('debug', `received data from post: ${all_data}`)
          resolve(JSON.parse(all_data))
        })
      })
      req.on('error', e => {
        this.instance.log('error', e.message)
        this.instance.updateStatus(InstanceStatus.UnknownError, e.message)
        reject()
      })
      req.write(body)
      req.end()
    })
  }
}
