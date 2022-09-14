import Image from 'next/image'
import { SelectAssetModal } from 'components/SelectAssetModal'

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

  const ConfirmSend = () => {
    return (
      <div className='w-full flex flex-col gap-2 bg-accent-focus rounded  text-white p-2'>
        <div>
          <h1 className='text-2xl'>Confirm Send:</h1>
          <p>
            Sending {Number(rawValue)} {asset.symbol} (
            <span className='text-primary-content'>${amountInUsd}</span>) to{' '}
            {recipient}
          </p>
          <p>
            Estimated fee: {fee.assetAmount.toNumber().toFixed(4)}{' '}
            {asset.symbol} (
            <span className='text-primary-content'>${feeInUsd}</span>)
          </p>
        </div>
        <button
          disabled={isFetchingFee}
          onClick={() => setIsPreviewTransactionModalOpen(true)}
          className='btn btn-secondary'
        >
          Preview Transaction
        </button>
      </div>
    )
  }

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
        <ConfirmSend />
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

function PreviewTransactionModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
}) {
  const { asset, amount, fee, recipient } = useSend()
  const { getAssetPriceInUsd } = useFiat()
  const { getMaxBalance } = useWallet()
  const amountInUsd = getAssetPriceInUsd(asset, amount)
  const feeInUsd = getAssetPriceInUsd(asset, fee)
  const balance = getMaxBalance(asset)
  const balanceInUsd = getAssetPriceInUsd(asset, balance)
  const endingBalance = balance.sub(fee).sub(amount)
  const endingBalanceInUsd = getAssetPriceInUsd(asset, endingBalance)

  const isTransactionValid = endingBalance.gt(0)
  return (
    <div className={`modal text-white ${isOpen && 'modal-open'}`}>
      <div className='modal-box relative'>
        <figure
          className='absolute cursor-pointer top-6 right-6'
          onClick={() => setIsOpen(false)}
        >
          <Image src='/x.svg' alt='x button' height={20} width={20} />
        </figure>
        <h3 className='font-bold text-2xl'>Preview Transaction</h3>
        <ul className='gap-2 p-2 flex flex-col'>
          <p>
            Sending {amount.assetAmount.toNumber()} {asset.symbol} (
            <span className='text-primary-content'>${amountInUsd}</span>) to{' '}
            <span className='text-secondary-focus'>{recipient}</span>
          </p>
          <p>
            Estimated fee: {fee.assetAmount.toNumber().toFixed(4)}{' '}
            {asset.symbol} (
            <span className='text-primary-content'>${feeInUsd}</span>)
          </p>
          <div className='divider' />
          <div className='flex justify-between items-center'>
            <div>
              <p>Balance before:</p>
              <p>
                {balance.assetAmount.toNumber()} {asset.symbol} (
                <span className='text-primary-content'>${balanceInUsd}</span>)
              </p>
            </div>
            <div>
              <p>Balance after:</p>
              <p>
                {endingBalance.assetAmount.toNumber()} {asset.symbol} (
                <span className='text-primary-content'>
                  ${endingBalanceInUsd}
                </span>
                )
              </p>
            </div>
          </div>
          {!isTransactionValid && (
            <p className='text-error mt-2 text-center'>
              Transaction is invalid
            </p>
          )}
        </ul>
        <button
          onClick={() => setIsOpen(false)}
          disabled={!isTransactionValid}
          className='mt-6 btn btn-primary w-full'
        >
          Confirm Transaction
        </button>
      </div>
    </div>
  )
}
