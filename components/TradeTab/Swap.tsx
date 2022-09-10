import Image from 'next/image'
import { AssetType, SelectAssetModal } from 'components/SelectAssetModal'
import { useActions, useAppState } from 'lib/overmind'

export function Swap() {
  const {
    swap: {
      inputAsset,
      outputAsset,
      rawValue,
      inputAmountInUsd,
      outputAmountInUsd,
      outputAmount,
    },
  } = useAppState()
  const {
    swap: { handleChange, handleGetQuote },
  } = useActions()

  return (
    <>
      <div className='flex bg-accent items-start rounded gap-4 p-6 text-accent-content text-xl flex-col m-6'>
        <div className='w-full justify-between flex'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <label htmlFor='asset'>Input asset </label>
              <a
                href='#selectInputAssetModal'
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
          <button onClick={handleGetQuote} className='btn btn-primary'>
            Get Quote
          </button>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <a
                href='#selectOutputAssetModal'
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
                  value={outputAmount.assetAmount.toNumber()}
                  placeholder='0.00'
                  className='input text-right input-bordered input-primary w-full max-w-xs text-white'
                />
              </div>
              <label htmlFor='value'>Value</label>
            </div>
          </div>
        </div>
      </div>
      <SelectAssetModal assetType={AssetType.Input} />
      <SelectAssetModal assetType={AssetType.Output} />
    </>
  )
}
