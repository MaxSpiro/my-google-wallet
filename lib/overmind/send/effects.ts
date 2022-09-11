import { Context } from '..'
import { getFeeEstimateByChain } from 'lib/helpers/fee'
import { Amount } from 'lib/entities'

export const getNetworkFeeByChain = async (
  chain: string,
  setFee: (amount: Amount) => void,
) => {
  setFee(await getFeeEstimateByChain(chain))
}
