import axios from 'axios'
import { Asset } from 'lib/entities'
import { Network } from 'lib/types'

export const api = {
  async loadAssetPrices(assets: Asset[]) {
    const res = await axios.get('http://localhost:3000/api/usd', {
      data: {
        assetIds: assets.map(asset => asset.toString()),
      }
    })
    return JSON.parse(res.data)
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
