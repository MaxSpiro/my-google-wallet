import Image from 'next/image'
import { SelectAssetModal } from 'components/modals/SelectAssetModal'
import { PreviewTransactionModal } from 'components/modals/PreviewTransactionModal'

import { useState } from 'react'
import { Amount, Asset } from 'lib/entities'
import { useSend } from 'lib/hooks/useSend'
import { useWallet } from 'lib/hooks/useWallet'
import { useFiat } from 'lib/hooks/useFiat'

export function Send() {
  const {
    asset,
    amount,
    fee,
    recipient,
    isFetchingFee,
    setRecipient,
    setAmount,
    setAsset,
  } = useSend()
  const { getMaxBalance } = useWallet()
  const { getAssetPriceInUsd } = useFiat()

  const [isSelectAssetModalOpen, setIsSelectAssetModalOpen] = useState(false)
  const [isPreviewTransactionModalOpen, setIsPreviewTransactionModalOpen] =
    useState(false)

  const [rawValue, setRawValue] = useState('')

  const feeInUsd = getAssetPriceInUsd(asset, fee)

  const amountInUsd =
    rawValue === '0' || !rawValue ? '0' : getAssetPriceInUsd(asset, amount)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'recipient') {
      setRecipient(event.target.value)
    }
    if (event.target.name === 'value') {
      const newValue = event.target.value
      if (!newValue) {
        setAmount(Amount.fromAssetAmount(0, asset.decimal))
        setRawValue('')
        return
      }
      if (newValue === '.') {
        setRawValue('0.')
        return
      }
      if (/^0[^.].*/.test(newValue)) {
        setRawValue(newValue.substring(1))
        return
      }
      if (/^\d*\.?\d*$/.test(newValue)) {
        setRawValue(event.target.value)
        setAmount(Amount.fromAssetAmount(event.target.value, asset.decimal))
      }
    }
  }

  const setMaxBalance = () => {
    setAmount(getMaxBalance(asset).sub(fee))
    setRawValue(getMaxBalance(asset).sub(fee).assetAmount.toNumber().toString())
  }

  const isFormValid = !isFetchingFee && recipient.length > 0 && amount.gt(0)

  return (
    <>
      <div className='flex bg-accent rounded gap-4 p-6 text-accent-content flex-col m-6'>
        <div className='flex items-center text-xl gap-2'>
          <label htmlFor='asset'>Asset: </label>
          <a
            onClick={() => setIsSelectAssetModalOpen(true)}
            className='btn border-primary text-xl cursor-pointer flex items-center gap-2'
          >
            <span className='font-semibold'>{asset.symbol} </span>
            <Image
              src='/arrow-down.svg'
              alt='arrow down'
              height={20}
              width={20}
            />
          </a>
        </div>

        <div className='flex items-center text-xl gap-2 relative max-w-xs'>
          <label htmlFor='value'>Value:</label>
          <input
            name='value'
            type='text'
            value={rawValue}
            onChange={handleChange}
            placeholder='0.00'
            className='input input-bordered input-primary w-full max-w-xs text-white'
          />
          <button
            onClick={setMaxBalance}
            className='uppercase text-sm absolute right-5 text-white'
          >
            Max
          </button>
        </div>

        <div className='flex items-center text-xl gap-2'>
          <label htmlFor='recipient '>Recipient:</label>
          <input
            name='recipient'
            type='text'
            value={recipient}
            onChange={handleChange}
            placeholder='0x12...123'
            className='input input-bordered input-primary w-full max-w-xs text-white'
          />
        </div>
        <p className='text-xl'>
          Estimated fee: {fee.assetAmount.toNumber().toFixed(4)} {asset.symbol}{' '}
          (<span className='text-primary-content'>${feeInUsd}</span>)
        </p>
        <button
          disabled={!isFormValid}
          onClick={() => setIsPreviewTransactionModalOpen(true)}
          className='btn btn-secondary'
        >
          Preview Transaction
        </button>
      </div>
      <SelectAssetModal
        setAsset={setAsset}
        isOpen={isSelectAssetModalOpen}
        setIsOpen={setIsSelectAssetModalOpen}
      />
      <PreviewTransactionModal
        isOpen={isPreviewTransactionModalOpen}
        setIsOpen={setIsPreviewTransactionModalOpen}
      />
    </>
  )
}
