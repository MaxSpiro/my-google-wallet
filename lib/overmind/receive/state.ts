import { Amount, Asset } from 'lib/entities'
import { derived } from 'overmind'

type State = {
  selectedAssetId: string
  selectedAsset: Asset
}

export const state: State = {
  selectedAssetId: Asset.getNativeAsset('BTC').toString(),
  selectedAsset: derived(
    (state: State) =>
      Asset.fromAssetId(state.selectedAssetId) ?? Asset.getNativeAsset('BTC'),
  ),
}
