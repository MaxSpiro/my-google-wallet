import { IWallet } from 'lib/types'

type State = {
  isConnected: boolean
  wallet: IWallet | null
  userInfo: any
}
export const state: State = {
  isConnected: false,
  wallet: null,
  userInfo: null,
}
