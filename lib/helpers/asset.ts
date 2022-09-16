import { Asset } from 'lib/entities'

export const isCoreAsset = (asset: Asset) => {
  return [
    Asset.ETH(),
    Asset.BCH(),
    Asset.MATIC(),
    Asset.DOGE(),
    Asset.BTC(),
    Asset.LTC(),
  ]
    .map((a) => a.toString())
    .includes(asset.toString())
}
