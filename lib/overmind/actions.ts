import { Amount, Asset } from 'lib/entities'
import { Context } from '.'

export const loadAssetPrices = async ({ effects, state }: Context, assets: Asset[]) => {
  state.assetPricesInUsd = JSON.parse(
    (await effects.api.loadAssetPrices(assets)).data,
  )
}

export const loadSupportedAssets = async({effects, state}: Context) => {
  const supportedAssets = effects.api.loadSupportedAssets()
  state.supportedAssets = supportedAssets
  
}

export const getAssetPriceInUsd = (
  { state }: Context,
  { asset, amount }: { asset: Asset; amount: Amount },
) => {
  return (
    Number(state.assetPricesInUsd[asset.symbol]) * amount.assetAmount.toNumber()
  )
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const onInitializeOvermind = async ({
  effects,
  actions,
  state,
}: Context) => {
  await actions.loadSupportedAssets()
  await actions.loadAssetPrices(state.supportedAssets)
  console.log('finished initializing')
  state.appLoading = false
}
