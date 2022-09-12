import { Address } from 'components'
import QRCode from 'react-qr-code'
import Image from 'next/image'
import { AssetType, SelectAssetModal } from 'components/SelectAssetModal'
import { useActions, useAppState } from 'lib/overmind'
import { useState } from 'react'

export function Receive() {
  const {
    wallet: { isConnected },
    receive: { selectedAsset },
  } = useAppState()
  const {
    getAssetPriceInUsd,
    wallet: { getAddressByChain, getMaxBalance },
  } = useActions()

  const address = getAddressByChain(selectedAsset.chain)
  const balance = getMaxBalance(selectedAsset)
  const balanceInUsd = getAssetPriceInUsd({
    asset: selectedAsset,
    amount: balance,
  })

  const [isSelectAssetModalOpen, setIsSelectAssetModalOpen] = useState(false)

  return (
    <>
      <div className='flex bg-accent items-start rounded gap-4 p-6 text-accent-content text-xl flex-col m-6'>
        <div className='flex items-center gap-2'>
          <label htmlFor='asset'>Asset: </label>
          <a
            onClick={() => setIsSelectAssetModalOpen(true)}
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
        {isConnected ? (
          <>
            <div className='flex gap-2 items-center'>
              <span>Address:</span>
              <Address
                address={address}
                asset={selectedAsset}
                expanded
                className='text-accent-content'
              />
            </div>
            <div>
              <span>Current balance: </span>
              <span>
                {balance.eq(0) ? (
                  'Empty!'
                ) : (
                  <>
                    {balance.assetAmount.toNumber().toString().includes('.')
                      ? balance.assetAmount.toNumber()
                      : balance.assetAmount.toNumber().toFixed(1)}{' '}
                    {selectedAsset.symbol}{' '}
                    <span>
                      <span className='text-primary-content'>
                        ($
                        {balanceInUsd})
                      </span>
                    </span>
                  </>
                )}
              </span>
            </div>
            <div className='bg-accent-focus relative p-6 pb-10 rounded-xl flex items-center justify-center'>
              <QRCode value={address} />
              <span className='text-primary-content absolute bottom-2'>
                Your {selectedAsset.symbol} address
              </span>
            </div>
          </>
        ) : (
          <>Connect wallet to see your address & balance</>
        )}
      </div>
      <SelectAssetModal
        assetType={AssetType.Receive}
        isOpen={isSelectAssetModalOpen}
        setIsOpen={setIsSelectAssetModalOpen}
      />
    </>
  )
}
