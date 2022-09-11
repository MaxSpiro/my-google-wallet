import { Amount, Asset } from 'lib/entities'

export enum Network {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export enum WalletOption {
  Social = 'social',
}
export interface TxParams {
  to: string
  asset: Asset
  value: Amount
  memo?: string
  gasLimit?: string
  gasPrice?: string
  fee?: string // for utxo/transfers only
}

export interface IWallet {
  walletType: WalletOption
  network: Network

  isConnected: boolean

  connect: (chains: string[]) => Promise<void>
  disconnect: () => Promise<void>

  getAddress: (chain: string) => string

  loadAllBalances: () => Promise<void>
  getBalance: (asset: Asset) => Amount

  signTransaction: (txParams: TxParams) => Promise<any>
  signAndSendTransaction: (txParams: TxParams) => Promise<any>

  signMessage: (chain: string, message: string) => Promise<any>

  isChainSupported: (chain: string) => boolean

  verifyAddress: (address: string, chain: string) => Promise<boolean>

  exposePrivateKey: () => string
}
