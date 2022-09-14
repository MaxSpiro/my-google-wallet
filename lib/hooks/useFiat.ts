import { Amount, Asset } from 'lib/entities'
import { useStore } from 'lib/zustand'

export const useFiat = () => {
  const assetPricesInUsd = useStore((state) => state.assetPricesInUsd)

  const getAssetPriceInUsd = (asset: Asset, amount: Amount): string => {
    const price = assetPricesInUsd[asset.toString()]
    if (!price) {
      return '0'
    }
    const value = amount.mul(price).assetAmount.toNumber()
    return Intl.NumberFormat('en', { notation: 'compact' }).format(value)
  }

  return {
    getAssetPriceInUsd,
  }
}
