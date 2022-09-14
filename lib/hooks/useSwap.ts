import { Amount, Asset } from 'lib/entities'
import toast from 'react-hot-toast'
import { useStore } from 'lib/zustand'
import { rangoClient } from 'lib/services/rango'

export const useSwap = () => {
  const swap = useStore((state) => state.swap)
  const wallet = useStore((state) => state.wallet)

  const setInputAsset = (asset: Asset) => {
    swap.setInputAsset(asset)
  }
  const setInputAmount = (amount: Amount) => {
    swap.setInputAmount(amount)
  }
  const setOutputAsset = (asset: Asset) => {
    swap.setOutputAsset(asset)
  }
  const setOutputAmount = (amount: Amount) => {
    swap.setOutputAmount(amount)
  }

  const [inputAsset, inputAmount, outputAsset, outputAmount, fee] = useStore(
    (state) => [
      state.swap.inputAsset,
      state.swap.inputAmount,
      state.swap.outputAsset,
      state.swap.outputAmount,
      state.swap.fee,
    ],
  )

  const setFee = (amount: Amount) => {
    swap.setFee(amount)
  }

  const handleConfirm = async () => {
    toast.error('Not implemented')
  }

  const handleGetQuote = async () => {
    if (swap.inputAmount.eq(0)) {
      toast.error('Please enter a value')
    }
    try {
      const {
        outputAmount,
        fee: { inboundFee, outboundFee },
      } = await toast.promise(
        rangoClient.getSwapQuote(
          swap.inputAsset,
          swap.outputAsset,
          swap.inputAmount,
        ),
        {
          loading: 'Fetching swap quote...',
          success: 'Quote retrieved!',
          error: (e) => e.toString(),
        },
      )

      if (inboundFee) {
        swap.setFee(inboundFee)
      }
      swap.setOutputAmount(outputAmount)
    } catch (e) {}
  }

  return {
    inputAsset,
    inputAmount,
    outputAsset,
    outputAmount,
    fee,
    setInputAsset,
    setOutputAsset,
    setInputAmount,
    setOutputAmount,
    setFee,
    handleConfirm,
    handleGetQuote,
  }
}
