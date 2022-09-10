import { Amount, Asset } from 'lib/entities'
import { derived } from 'overmind'

type State = {
  inputAsset: Asset
  outputAsset: Asset
  rawValue: string
  inputAmount: Amount
  outputAmount: Amount
  fee: Amount
  inputAmountInUsd: string
  outputAmountInUsd: string
}

export const state: State = {
  inputAsset: Asset.getNativeAsset('BTC'),
  outputAsset: Asset.getNativeAsset('ETH'),
  rawValue: '0',
  inputAmount: derived((state: State) =>
    Amount.fromAssetAmount(Number(state.rawValue), state.inputAsset.decimal),
  ),
  outputAmount: Amount.fromAssetAmount(0, 8),
  fee: Amount.fromAssetAmount(0, 8),
  inputAmountInUsd: '0',
  outputAmountInUsd: '0',
}
