import Image from 'next/image'
import { AssetType, SelectAssetModal } from 'components/SelectAssetModal'
import { useActions, useAppState } from 'lib/overmind'
import { useState } from 'react'
import { Amount } from 'lib/entities'

export function Send() {
  const {
    send: { amount, selectedAsset, recipient, fee, isFormComplete },
  } = useAppState()
  const {
    send: { handleSubmit, setAmount, setRecipient },
    wallet: { getMaxBalance },
    getAssetPriceInUsd,
  } = useActions()

  const feeInUsd = getAssetPriceInUsd({ asset: selectedAsset, amount: fee })

  const [rawValue, setRawValue] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'recipient') {
      setRecipient(event.target.value)
    }
    if (event.target.name === 'value') {
      const newValue = event.target.value
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
        setAmount(
          Amount.fromAssetAmount(event.target.value, selectedAsset.decimal),
        )
      }
    }
  }

  const setMaxBalance = () => {
    setAmount(getMaxBalance(selectedAsset))
    setRawValue(getMaxBalance(selectedAsset).assetAmount.toNumber().toString())
  }

  const amountInUsd =
    rawValue === '0' || !rawValue
      ? '0'
      : getAssetPriceInUsd({ asset: selectedAsset, amount })

  const ConfirmSend = () => {
    return (
      <div className='w-full flex justify-between items-center bg-accent-focus rounded  text-white p-2'>
        <div>
          <h1 className='text-2xl'>Confirm Send:</h1>
          <p>
            Sending {Number(rawValue)} {selectedAsset.symbol} (
            <span className='text-primary-content'>${amountInUsd}</span>) to{' '}
            {recipient}
          </p>
          <p>
            Estimated fee: {fee.assetAmount.toNumber().toFixed(4)}{' '}
            {selectedAsset.symbol} (
            <span className='text-primary-content'>${feeInUsd}</span>)
          </p>
        </div>
        <button onClick={handleSubmit} className='btn btn-secondary'>
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
            href='#selectSendAssetModal'
            className='btn border-primary text-xl cursor-pointer flex items-center gap-2'
          >
            <span className='font-semibold'>{selectedAsset.symbol} </span>
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
        {isFormComplete && <ConfirmSend />}
      </div>
      <SelectAssetModal assetType={AssetType.Send} />
    </>
  )
}
