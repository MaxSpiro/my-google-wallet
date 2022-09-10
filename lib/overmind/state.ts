import { Asset } from 'lib/entities'

type State = {
  assetPricesInUsd: Record<string, string>
  supportedAssets: Asset[]
  appLoading: boolean
}

export const state: State = {
  assetPricesInUsd: {
    BTC: '20000',
  },
  supportedAssets: [],
  appLoading: true
}
