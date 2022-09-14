import Image from 'next/image'
import { SelectAssetModal } from 'components/SelectAssetModal'
import { useState } from 'react'
import { useSwap } from 'lib/hooks/useSwap'
import { Amount, Asset } from 'lib/entities'
import { useFiat } from 'lib/hooks/useFiat'

export function Swap() {
  const {
    inputAsset,
    inputAmount,
    outputAsset,
    outputAmount,
    fee,
    setInputAmount,
    setInputAsset,
    setOutputAsset,
    handleGetQuote,
  } = useSwap()

  const { getAssetPriceInUsd } = useFiat()

  const inputAmountInUsd = getAssetPriceInUsd(inputAsset, inputAmount)
  const outputAmountInUsd = getAssetPriceInUsd(outputAsset, outputAmount)

  const [isSelectInputAssetModalOpen, setIsSelectInputAssetModalOpen] =
    useState(false)
  const [isSelectOutputAssetModalOpen, setIsSelectOutputAssetModalOpen] =
    useState(false)

  const [rawValue, setRawValue] = useState('')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'value') {
      const newValue = event.target.value
      if (newValue === '.') {
        setRawValue('0.')
        return
      }
      if (/^\d*\.?\d*$/.test(newValue)) {
        setRawValue(event.target.value)

        setInputAmount(
          Amount.fromAssetAmount(!!newValue ? newValue : 0, inputAsset.decimal),
        )
      }
    }
  }

  return (
    <>
      <div className='flex bg-accent items-start rounded gap-4 p-6 text-accent-content text-xl flex-col m-6'>
        <div className='w-full grid-cols-5 grid'>
          <div className='flex flex-col gap-4 col-span-2'>
            <div className='flex items-center gap-2'>
              <label htmlFor='asset'>Input asset </label>
              <a
                onClick={() => setIsSelectInputAssetModalOpen(true)}
                className='btn border-primary text-xl cursor-pointer flex items-center gap-2'
              >
                <span className='font-semibold'>{inputAsset.symbol} </span>
                <Image
                  src='/arrow-down.svg'
                  alt='arrow down'
                  height={20}
                  width={20}
                />
              </a>
            </div>
            <div className='flex items-center text-xl gap-2 max-w-xs'>
              <label htmlFor='value'>Value</label>
              <div className='relative flex items-center '>
                <input
                  name='value'
                  type='text'
                  value={rawValue}
                  onChange={handleChange}
                  placeholder='0.00'
                  className='input input-bordered input-primary w-full max-w-xs text-white'
                />
                <span className='uppercase text-sm absolute right-5 text-primary-content'>
                  ${inputAmountInUsd}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleGetQuote}
            className='btn btn-primary col-span-1'
          >
            Get Quote
          </button>
          <div className='flex flex-col gap-4 col-span-2 items-end'>
            <div className='flex items-center gap-2'>
              <a
                onClick={() => setIsSelectOutputAssetModalOpen(true)}
                className='btn border-primary text-xl cursor-pointer flex items-center gap-2'
              >
                <span className='font-semibold'>{outputAsset.symbol} </span>
                <Image
                  src='/arrow-down.svg'
                  alt='arrow down'
                  height={20}
                  width={20}
                />
              </a>
              <label htmlFor='asset'>Output asset </label>
            </div>
            <div className='flex items-center text-xl gap-2 max-w-xs'>
              <div className='relative flex items-center'>
                <span className='uppercase text-sm absolute left-5 text-primary-content'>
                  ${outputAmountInUsd}
                </span>
                <input
                  name='value'
                  type='text'
                  readOnly
                  value={outputAmount.assetAmount.toNumber().toFixed(2)}
                  placeholder='0.00'
                  className='input text-right input-bordered input-primary w-full max-w-xs text-white'
                />
              </div>
              <label htmlFor='value'>Value</label>
            </div>
          </div>
        </div>
      </div>
      <SelectAssetModal
        setAsset={setInputAsset}
        isOpen={isSelectInputAssetModalOpen}
        setIsOpen={setIsSelectInputAssetModalOpen}
      />
      <SelectAssetModal
        setAsset={setOutputAsset}
        isOpen={isSelectOutputAssetModalOpen}
        setIsOpen={setIsSelectOutputAssetModalOpen}
      />
    </>
  )
}
