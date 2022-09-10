import { Asset } from 'lib/entities'
import { Context } from '..'

export const setReceiveAsset = ({ state }: Context, asset: Asset) => {
  state.receive.asset = asset
}
