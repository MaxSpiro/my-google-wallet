import { Amount, Asset } from 'lib/entities'
import { getFeeEstimateByChain } from 'lib/helpers/fee'
import toast from 'react-hot-toast'
import { Context } from '..'

export const setRecipient = ({ state }: Context, recipient: string) => {
  state.send.recipient = recipient
}

export const setSendAsset = ({ state, effects, actions }: Context, asset: Asset) => {
  state.send.selectedAssetId = asset.toString()
  effects.send.getNetworkFeeByChain(state.send.selectedAsset.chain, (amount: Amount) => actions.send.setFee(amount))
}

export const setFee = ({ state }: Context, fee: Amount) => {
  state.send.fee = fee
}

export const setAmount = ({ state }: Context, amount: Amount) => {
  state.send.amount = amount
}

export const handleSubmit = async ({ state, actions, effects }: Context) => {
  if (!state.wallet.isConnected) {
    toast.error('Must be logged in')
    return
  }
  const isAddressValid = await actions.wallet.verifyAddress({
    address: state.send.recipient,
    chain: state.send.selectedAsset.chain,
  })
  if (!isAddressValid) {
    toast.error('Invalid address')
    return
  }
  toast.error(
    `asset ${state.send.selectedAsset.toString()}, amount ${
      state.send.amount
    }, recipient ${state.send.recipient}`,
  )
}
