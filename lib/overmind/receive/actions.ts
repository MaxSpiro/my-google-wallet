import { Asset } from 'lib/entities'
import { Context } from '..'

export const setReceiveAsset = ({ state }: Context, asset: Asset) => {
  state.receive.selectedAssetId = asset.toString()
}
