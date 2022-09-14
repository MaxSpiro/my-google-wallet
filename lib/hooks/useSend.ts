import { Amount, Asset } from 'lib/entities'
import { getFeeEstimateByChain } from 'lib/helpers/fee'
import { useStore } from 'lib/zustand'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export const useSend = () => {
  const send = useStore((state) => state.send)
  const wallet = useStore((state) => state.wallet)

  const [asset, amount, fee, setFee, recipient] = useStore((state) => [
    state.send.asset,
    state.send.amount,
    state.send.fee,
    state.send.setFee,
    state.send.recipient,
  ])

  const [isFetchingFee, setIsFetchingFee] = useState(false)

  const setAsset = (asset: Asset) => {
    send.setAsset(asset)
  }

  const setAmount = (amount: Amount) => {
    send.setAmount(amount)
  }

  const setRecipient = (recipient: string) => {
    send.setRecipient(recipient)
  }

  const handleConfirm = async () => {
    if (!wallet) {
      toast.error('Wallet not connected')
      return
    }
    await toast.promise(
      wallet.signAndSendTransaction({
        asset: send.asset,
        value: send.amount,
        to: send.recipient,
        fee: send.fee.baseAmount.toString(),
      }),
      {
        loading: 'Sending...',
        success: 'Sent!',
        error: 'Error sending',
      },
    )
  }

  useEffect(() => {
    const getFee = async () => {
      setFee(Amount.fromAssetAmount(0, asset.decimal))
      setIsFetchingFee(true)
      const fee = await getFeeEstimateByChain(asset.chain)
      setFee(fee)
      setIsFetchingFee(false)
    }

    getFee()
  }, [asset, setFee])

  return {
    asset,
    amount,
    fee,
    recipient,
    isFetchingFee,
    setAsset,
    setAmount,
    setRecipient,
    handleConfirm,
  }
}
