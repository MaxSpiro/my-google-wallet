import { Amount, Asset } from 'lib/entities'
import { derived } from 'overmind'

type State = {
  inputAssetId: string
  outputAssetId: string
  inputAsset: Asset
  outputAsset: Asset
  rawValue: string
  inputAmount: Amount
  outputAmount: Amount
  fee: Amount
}

export const state: State = {
  inputAssetId: Asset.getNativeAsset('BTC').toString(),
  outputAssetId: Asset.getNativeAsset('ETH').toString(),
  inputAsset: derived((state: State) => Asset.fromAssetId(state.inputAssetId)) ?? Asset.getNativeAsset('BTC'),
  outputAsset: derived((state: State) => Asset.fromAssetId(state.outputAssetId)) ?? Asset.getNativeAsset('ETH'),
  rawValue: '0',
  inputAmount: derived((state: State) =>
    Amount.fromAssetAmount(Number(state.rawValue), state.inputAsset.decimal),
  ),
  outputAmount: Amount.fromAssetAmount(0, 8),
  fee: Amount.fromAssetAmount(0, 8),
}
