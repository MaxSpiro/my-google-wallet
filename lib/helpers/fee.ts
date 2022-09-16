import axios from 'axios'
import { Amount } from 'lib/entities'

const BLOCKCYPHER_BASEURL = 'https://api.blockcypher.com/v1'
const BLOCKNATIVE_BASEURL = 'https://api.blocknative.com'

export const getFeeEstimateByChain = async (chain: string): Promise<Amount> => {
  try {
    if (chain === 'BTC' || chain === 'DOGE' || chain === 'LTC') {
      const res = await axios.get(
        `${BLOCKCYPHER_BASEURL}/${chain.toLowerCase()}/main`,
      )
      return Amount.fromBaseAmount(res.data?.medium_fee_per_kb, 8)
    }
    if (chain === 'BCH') {
      return Amount.fromAssetAmount(0.000003, 8)
    }
    if (chain === 'ETH' || chain === 'POLYGON') {
      try {
        const res = await axios.get(
          `${
            BLOCKNATIVE_BASEURL
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
        console.error(e)
      }
    }
    return Amount.fromBaseAmount(0, 8)
  } catch (e) {
    return Amount.fromBaseAmount(0, 8)
  }
}
