import { Amount, Asset } from '../entities'
import { TxParams } from '../types'

export interface IWalletProvider {
  getAddress: () => string
  getBalance: (asset?: Asset) => Amount

  updateBalance: (assets?: Asset[]) => Promise<void>
  init: () => Promise<void>

  signTransaction: (txParams: TxParams) => Promise<any>
  signAndSendTransaction: (txParams: TxParams) => Promise<string>

  signMessage: (message: string) => Promise<string>

  verifyAddress: (address: string) => Promise<boolean>

  nativeAsset: Asset
}

export interface UserInfo {
  email: string
  name: string
  profileImage: string
  aggregateVerifier: string
  verifier: string
  verifierId: string
  typeOfLogin: string
  dappShare: string
  idToken: string
  oAuthIdToken: string
  oAuthAccessToken: string
}
