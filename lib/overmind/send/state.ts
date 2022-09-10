import { Amount, Asset } from 'lib/entities'

type State = {
  asset: Asset
  recipient: string
  rawValue: string
  amount: Amount
  amountInUsd: string
  fee: Amount
  feeInUsd: string
  isFormComplete: boolean
  isFormValid: boolean
}

export const state: State = {
  asset: Asset.getNativeAsset('BTC'),
  recipient: '',
  rawValue: '0',
  amount: Amount.fromAssetAmount(0, 8),
  amountInUsd: '0',
  fee: Amount.fromAssetAmount(0, 8),
  feeInUsd: '0',
  isFormComplete: false,
  isFormValid: false,
}

// useEffect(() => {
//   const getFee = async () => {
//     setFee(await getFeeEstimateByChain(sendAsset.chain))
//   }
//   getFee()
// }, [sendAsset.chain])

