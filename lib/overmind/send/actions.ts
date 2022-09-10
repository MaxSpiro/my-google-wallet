import { Asset } from 'lib/entities'
import toast from 'react-hot-toast'
import { Context } from '..'

export const handleChange = (
  { state }: Context,
  event: React.ChangeEvent<HTMLInputElement>,
) => {
  if (event.target.name === 'recipient') {
    state.send.recipient = event.target.value
  }
  if (event.target.name === 'value') {
    const newValue = event.target.value
    if (newValue === '.') {
      state.send.rawValue = '0.'
      return
    }
    if (/^\d*\.?\d*$/.test(newValue)) {
      state.send.rawValue = event.target.value
    }
  }
}
export const setMaxBalance = ({ state }: Context) => {
  // const maxBalance = getMaxBalance(sendAsset).sub(state.send.fee)
  // state.send.rawValue = maxBalance.assetAmount.toNumber().toString()
  state.send.rawValue = ''
}

export const setSendAsset = ({ state }: Context, asset: Asset) => {
  state.send.asset = asset
}

export const handleSubmit = async () => {
  // if (!isConnected) {
  //   toast.error('Must be logged in')
  //   return
  // }
  // const isAddressValid = await verifyAddress(recipient, sendAsset.chain)
  // if (!isAddressValid) {
  //   toast.error('Invalid address')
  //   return
  // }
  toast.error('Not implemented')
}
