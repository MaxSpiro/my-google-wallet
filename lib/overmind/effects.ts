import axios from 'axios'
import { Asset } from 'lib/entities'

export const api = {
  loadAssetPrices(assets: Asset[]) {
    return axios.get(
      `/api/usd?symbols=${assets.map((a) => a.symbol).join(',')}`,
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
