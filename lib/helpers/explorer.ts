import { network } from 'lib/config'
import { Asset } from 'lib/entities'
export const getAddressExplorerUrl = (
  asset: Asset,
  address: string,
): string => {
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
    case 'POLYGON':
      return `https://${
        network === 'testnet' ? 'mumbai.' : ''
      }polygonscan.com/address/${address}`
  }
  return ''
}

export const getTxExplorerUrl = (asset: Asset, txHash: string): string => {
  switch (asset.chain) {
    case 'BTC':
      return `https://blockchain.com/btc${
        network === 'testnet' ? '-testnet' : ''
      }/tx/${txHash}`
    case 'BCH':
      return `https://blockchain.com/bch${
        network === 'testnet' ? '-testnet' : ''
      }/tx/${txHash}`
    case 'LTC':
      return `https://blockexplorer.one/litecoin/${
        network === 'testnet' ? 'testnet' : 'mainnet'
      }/tx/${txHash}`
    case 'DOGE':
      return `https://blockexplorer.one/dogecoin/${
        network === 'testnet' ? 'testnet' : 'mainnet'
      }/tx/${txHash}`
    case 'ETH':
      return `https://${
        network === 'testnet' ? 'ropsten.' : ''
      }etherscan.io/tx/${txHash}`
    case 'POLYGON':
      return `https://${
        network === 'testnet' ? 'mumbai.' : ''
      }polygonscan.com/tx/${txHash}`
  }
  return ''
}
