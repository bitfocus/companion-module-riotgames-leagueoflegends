import { SomeCompanionConfigField } from '@companion-module/base'
import { Regex } from '@companion-module/base'

export interface Config {
  host: string
  apiPollingInterval: number
}

export const getConfigFields = (): SomeCompanionConfigField[] => {
  return [
    {
      type: 'static-text',
      id: 'info',
      width: 12,
      label: 'Getting Started',
      value: `This module utilizes the League of Legends <a href="https://developer.riotgames.com/docs/lol#game-client-api_replay-api">Replay API</a>, to adjust the in-game camera during replays.
      <br></br>
      By default the Replay API is disabled. To start using this module, enable the Replay API in the game client config by locating where your game is installed and adding the following lines to the <em>game.cfg</em> file:
      <br></br>
      Example file location:
      </br>
      <em>C:\\Riot Games\\League of Legends\\Config\\game.cfg</em>
      <br></br>
      <code>[General]</br>
      EnableReplayApi=1
      </code>
      <br></br>
      For more information on the Replay API, visit the <a href="https://developer.riotgames.com/docs/lol#game-client-api_replay-api">Riot Games Developer Portal</a>.
      `,
    },
    {
      type: 'textinput',
      id: 'host',
      label: 'Taget host',
      width: 6,
      regex: Regex.IP,
    },
    {
      type: 'number',
      id: 'apiPollingInterval',
      label: 'API Polling interval (ms) (default: 250, min: 100)',
      width: 6,
      default: 250,
      min: 100,
      max: 10000,
    },
  ]
}
