import { Amount, Asset } from 'lib/entities'
import { Network } from 'lib/types'
import { rehydrate } from 'overmind'
import { Context } from '.'

export const loadAssetPrices = async (
  { effects, state }: Context,
  assets: Asset[],
) => {
  try {
    const res = await effects.api.loadAssetPrices(assets)
    console.log(res)
    if (res) {
      state.assetPricesInUsd = res
    }
  } catch (e) {
    console.error('error fetching asset prices', e)
  }
}

export const loadSupportedAssets = async ({ effects, state }: Context) => {
  const supportedAssets = effects.api.loadSupportedAssets()
  state.supportedAssets = supportedAssets
}

export const getAssetPriceInUsd = (
  { state }: Context,
  { asset, amount }: { asset: Asset; amount: Amount },
) => {
  return !!state.assetPricesInUsd[asset.toString()]
    ? Intl.NumberFormat('en', { notation: 'compact' }).format(
        Number(state.assetPricesInUsd[asset.symbol]) *
          amount.assetAmount.toNumber(),
      )
    : '0'
}

export const onInitializeOvermind = async ({
  effects,
  actions,
  state,
}: Context) => {
  await actions.loadSupportedAssets()
  await actions.loadAssetPrices(state.supportedAssets)
  actions.send.setSendAsset(state.send.selectedAsset)
  state.appLoading = false
  console.log('in initialize', state.assetPricesInUsd)
}

export const changePage = (
  { state }: Context,
  { mutations }: { mutations: any },
) => {
  rehydrate(state, mutations || [])
}
