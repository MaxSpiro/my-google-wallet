import { Asset } from 'lib/entities'
import { Network } from 'lib/types'

type State = {
  assetPricesInUsd: Record<string, string>
  supportedAssets: Asset[]
  appLoading: boolean
}

export const state: State = {
  assetPricesInUsd: {
    BTC: '20000',
  },
  supportedAssets: [Asset.getNativeAsset('BTC')],
  appLoading: true,
}
