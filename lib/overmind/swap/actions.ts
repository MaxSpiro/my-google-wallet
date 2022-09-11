import { Asset } from 'lib/entities'
import { rangoClient } from 'lib/services/rango'
import toast from 'react-hot-toast'
import { Context } from '../'

export const setInputAsset = ({ state }: Context, asset: Asset) => {
  state.swap.inputAssetId = asset.toString()
}
export const setOutputAsset = ({ state }: Context, asset: Asset) => {
  state.swap.outputAssetId = asset.toString()
}

export const handleChange = (
  { state }: Context,
  event: React.ChangeEvent<HTMLInputElement>,
) => {
  if (event.target.name === 'value') {
    const newValue = event.target.value
    if (newValue === '.') {
      state.swap.rawValue = '0.'
      return
    }
    if (/^\d*\.?\d*$/.test(newValue)) {
      state.swap.rawValue = event.target.value
    }
  }
}

export const handleGetQuote = async ({ state }: Context) => {
  if (state.swap.rawValue === '') {
    toast.error('Please enter a value')
  }
  try {
    const {
      outputAmount,
      fee: { inboundFee, outboundFee },
    } = await toast.promise(
      rangoClient.getSwapQuote(
        state.swap.inputAsset,
        state.swap.outputAsset,
        state.swap.inputAmount,
      ),
      {
        loading: 'Fetching swap quote...',
        success: 'Quote retrieved!',
        error: (e) => e.toString(),
      },
    )

    if (inboundFee) {
      state.swap.fee = inboundFee
    }
    state.swap.outputAmount = outputAmount
  } catch (e) {}
}
