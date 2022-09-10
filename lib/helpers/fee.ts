import axios from 'axios'
import { Amount } from 'lib/entities'

export const getFeeEstimateByChain = async (chain: string): Promise<Amount> => {
  try {
    if (chain === 'BTC' || chain === 'DOGE' || chain === 'LTC') {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BLOCKCYPHER_BASEURL
        }/${chain.toLowerCase()}/main`,
      )
      return Amount.fromBaseAmount(res.data?.medium_fee_per_kb, 8)
    }
    if (chain === 'BCH') {
      return Amount.fromAssetAmount(0.000003, 8)
    }
    if (chain === 'GAIA') {
      return Amount.fromAssetAmount(0.004, 6)
    }
    if (chain === 'ETH' || chain === 'MATIC') {
      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BLOCKNATIVE_BASEURL
          }/gasprices/blockprices?chainid=${chain === 'ETH' ? 1 : 137}`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_BLOCKNATIVE_APIKEY ?? '',
            },
          },
        )
        return Amount.fromBaseAmount(
          Number(res.data.blockPrices[0].estimatedPrices[0].price) *
            1000000000 *
            21000,
          18,
        )
      } catch (e) {
        console.log(e)
      }
    }
    return Amount.fromBaseAmount(0, 8)
  } catch (e) {
    return Amount.fromBaseAmount(0, 8)
  }
}
