import { Asset } from 'lib/entities'

export const fetchAssetPrices = async (
  assets: Asset[],
): Promise<Record<string, string>> => {
  if (typeof window === 'undefined') {
    return {}
  }
  try {
    const assetPricesInUsd = await fetch(
      `${window.origin}/api/usd?assetIds=${assets.map((a) => a.toString())}`,
    ).then((res) => res.json())
    return JSON.parse(assetPricesInUsd)
  } catch (e) {
    return {}
  }
}

export const fetchSingleAssetPrice = async (asset: Asset): Promise<string> => {
  if (typeof window === 'undefined') {
    return '0'
  }
  try {
    const assetPricesInUsd = await fetch(
      `${window.origin}/api/usd?assetIds=${asset.toString()}`,
    ).then((res) => res.json())
    return JSON.parse(assetPricesInUsd)[asset.toString()]
  } catch (e) {
    return '0'
  }
}
