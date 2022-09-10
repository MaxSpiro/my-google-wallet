import { IWallet } from 'lib/web3auth-sdk'

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
