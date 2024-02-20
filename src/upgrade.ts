import {
  CompanionStaticUpgradeScript,
  // CompanionStaticUpgradeResult,
} from '@companion-module/base'
import { Config } from './config'

// const exampleUpgradeScript: CompanionStaticUpgradeScript<Config> = (
//   _context,
//   props,
// ): CompanionStaticUpgradeResult<Config> => {
//   return {
//     updatedConfig: props.config,
//     updatedActions: props.actions,
//     updatedFeedbacks: props.feedbacks,
//   }
// }

export const UpgradeScripts: CompanionStaticUpgradeScript<Config>[] = []
