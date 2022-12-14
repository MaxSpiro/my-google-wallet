import { Network } from 'lib/types'
import { InfuraApiKey } from '../constants'
import { IWalletProvider } from '../types'

import { BCHProvider } from './bchProvider'
import { BTCProvider } from './btcProvider'
import { DOGEProvider } from './dogeProvider'
import { EVMProvider } from './evmProvider'
import { LTCProvider } from './ltcProvider'

export const getWalletProvider = (
  chain: string,
  privateKey: string,
  network: Network,
): IWalletProvider => {
  if (chain === 'LTC') {
    return new LTCProvider(privateKey, network)
  }
  if (chain === 'BTC') {
    return new BTCProvider(privateKey, network)
  }
  if (chain === 'DOGE') {
    return new DOGEProvider(privateKey, network)
  }
  if (chain === 'BCH') {
    return new BCHProvider(privateKey, network)
  }
  return new EVMProvider(privateKey, network, chain, getRpcUrlsByChain(chain))
}

function getRpcUrlsByChain(chain: string): {
  mainnet: string
  testnet: string
} {
  if (chain === 'ETH') {
    const mainnet = `https://mainnet.infura.io/v3/${InfuraApiKey}`
    const testnet = `https://ropsten.infura.io/v3/${InfuraApiKey}`
    return { mainnet, testnet }
  }
  if (chain === 'BSC') {
    const mainnet = 'https://bsc-dataseed.binance.org/' // chainid 0x38
    const testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545/' // chainid 0x61
    return { mainnet, testnet }
  }
  const mainnet = `https://polygon-mainnet.infura.io/v3/${InfuraApiKey}`
  const testnet = `https://polygon-mumbai.infura.io/v3/${InfuraApiKey}`
  return { mainnet, testnet }
}
