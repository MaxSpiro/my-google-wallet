import { IContext } from 'overmind'
import { merge, namespaced } from 'overmind/config'
import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from 'overmind-react'

import * as swap from './swap'
import * as send from './send'
import * as receive from './receive'
import * as wallet from './wallet'

import { state } from './state'
import * as actions from './actions'
import * as effects from './effects'

export const config = merge(
  {
    state,
    actions,
    effects,
  },
  namespaced({
    swap,
    send,
    receive,
    wallet,
  }),
)

export type Context = IContext<typeof config>
export const useAppState = createStateHook<Context>()
export const useActions = createActionsHook<Context>()
export const useEffects = createEffectsHook<Context>()
export const useReaction = createReactionHook<Context>()
