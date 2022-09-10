import { Amount, Asset } from 'lib/entities'

type State = {
  asset: Asset
  balance: Amount
  balanceInUsd: string
  address: string
}

export const state: State = {
  asset: Asset.getNativeAsset('BTC'),
  balance: Amount.fromAssetAmount(0, 8),
  balanceInUsd: '0',
  address: '',
}
