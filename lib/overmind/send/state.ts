import { Amount, Asset } from 'lib/entities'
import { derived } from 'overmind'

type State = {
  selectedAssetId: string
  selectedAsset: Asset
  recipient: string
  amount: Amount
  fee: Amount
  isFormComplete: boolean
}

export const state: State = {
  selectedAssetId: Asset.getNativeAsset('BTC').toString(),
  selectedAsset:
    derived((state: State) => Asset.fromAssetId(state.selectedAssetId)) ??
    Asset.getNativeAsset('BTC'),
  recipient: '',
  amount: Amount.fromAssetAmount(0, 8),
  fee: Amount.fromAssetAmount(0, 8),
  isFormComplete: derived(
    (state: State) =>
      state.recipient.length > 0 && state.amount.baseAmount.toNumber() !== 0,
  ),
}

// useEffect(() => {
//   const getFee = async () => {
//     setFee(await getFeeEstimateByChain(sendAsset.chain))
//   }
//   getFee()
// }, [sendAsset.chain])
