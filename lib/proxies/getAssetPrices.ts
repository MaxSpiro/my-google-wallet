import { Asset } from 'lib/entities'

export const fetchAssetPrices = async (
  assets: Asset[],
): Promise<Record<string, string>> => {
  try {
    const assetPricesInUsd = await fetch(
      `http://localhost:3000/api/usd?assetIds=${assets.map((a) =>
        a.toString(),
      )}`,
    ).then((res) => res.json())
    return JSON.parse(assetPricesInUsd)
  } catch (e) {
    return {}
  }
}

export const fetchSingleAssetPrice = async (asset: Asset): Promise<string> => {
  try {
    const assetPricesInUsd = await fetch(
      `http://localhost:3000/api/usd?assetIds=${asset.toString()}`,
    ).then((res) => res.json())
    return JSON.parse(assetPricesInUsd)[asset.toString()]
  } catch (e) {
    return '0'
  }
}
