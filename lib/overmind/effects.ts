import axios from 'axios'
import { Asset } from 'lib/entities'
import { Network } from 'lib/types'

export const api = {
  loadAssetPrices(assets: Asset[]) {
    return axios.get(
      `http://localhost:3000/api/usd?symbols=${assets
        .map((a) => a.symbol)
        .join(',')}`,
    )
  },
  loadSupportedAssets() {
    return [
      Asset.getNativeAsset('BTC'),
      Asset.getNativeAsset('ETH'),
      Asset.getNativeAsset('LTC'),
      Asset.getNativeAsset('DOGE'),
      Asset.getNativeAsset('BCH'),
      Asset.getNativeAsset('MATIC'),
      Asset.getNativeAsset('GAIA'),
    ]
  },
}
