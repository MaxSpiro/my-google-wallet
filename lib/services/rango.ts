import { Amount, Asset } from 'lib/entities'
import { RangoClient as RangoBasicClient, SwapFee } from 'rango-sdk-basic'
import { rangoApiKey } from 'lib/config'

class RangoClient {
  private rangoClient = new RangoBasicClient(rangoApiKey)
  constructor() {}
  async getSwapQuote(inputAsset: Asset, outputAsset: Asset, amount: Amount) {
    const { resultType, route } = await this.rangoClient.quote({
      from: {
        blockchain: inputAsset.chain,
        symbol: inputAsset.symbol,
        address: inputAsset.address || null,
      },
      to: {
        blockchain: outputAsset.chain,
        symbol: outputAsset.symbol,
        address: outputAsset.address || null,
      },
      amount: amount.baseAmount.toString(),
    })

    if (resultType === 'NO_ROUTE')
      throw new Error('There is no route for the given assets.')

    if (resultType !== 'OK')
      throw new Error('An error has occurred while getting the quote.')

    if (!route)
      throw new Error(
        'An error has occurred while getting the route information',
      )

    const inputAmount = amount
    const outputAmount = Amount.fromBaseAmount(
      route.outputAmount,
      outputAsset.decimal,
    )

    const inboundFee = this.getSwapFee(inputAsset, route.fee)
    const outboundFee = this.getSwapFee(outputAsset, route.fee)

    return {
      inputAsset,
      inputAmount,
      outputAsset,
      outputAmount,
      fee: { inboundFee, outboundFee },
    }
  }
  getSwapFee(asset: Asset, swapFees: SwapFee[]): Amount | null {
    const fees = swapFees.filter(
      (f) =>
        f.token.blockchain === asset.chain && f.token.symbol === asset.symbol,
    )

    let fee: Amount | null = null

    if (fees.length > 0) {
      fee = Amount.fromBaseAmount(fees[0].amount, asset.decimal)
    }

    return fee
  }
}

export const rangoClient = new RangoClient()
