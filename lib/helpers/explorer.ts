import { network } from 'lib/config'
import { Asset } from 'lib/entities'
export const getExplorerUrl = (asset: Asset, address: string): string => {
  switch (asset.chain) {
    case 'BTC':
      return `https://blockchain.com/btc${
        network === 'testnet' ? '-testnet' : ''
      }/address/${address}`
    case 'BCH':
      return `https://blockchain.com/bch${
        network === 'testnet' ? '-testnet' : ''
      }/address/${address}`
    case 'LTC':
      return `https://blockexplorer.one/litecoin/${
        network === 'testnet' ? 'testnet' : 'mainnet'
      }/address/${address}`
    case 'DOGE':
      return `https://blockexplorer.one/dogecoin/${
        network === 'testnet' ? 'testnet' : 'mainnet'
      }/address/${address}`
    case 'ETH':
      return `https://${
        network === 'testnet' ? 'ropsten.' : ''
      }etherscan.io/address/${address}`
    case 'MATIC':
      return `https://${
        network === 'testnet' ? 'mumbai.' : ''
      }polyscan.com/address/${address}`
    case 'GAIA':
      return network === 'testnet'
        ? `https://explorer.theta-testnet.polypore.xyz/account/${address}`
        : `https://atomscan.com/accounts/${address}`
  }
  return ''
}
