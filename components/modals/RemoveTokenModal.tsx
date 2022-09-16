import { Asset } from 'lib/entities'
import { isCoreAsset } from 'lib/helpers/asset'
import { useWallet } from 'lib/hooks/useWallet'
import { useStore } from 'lib/zustand'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const RemoveTokenModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
}) => {
  const [trackedAssets, removeTrackedAsset] = useStore((store) => [
    store.trackedAssets,
    store.removeTrackedAsset,
  ])

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  const removableAssets = trackedAssets.filter((a) => !isCoreAsset(a))

  const handleConfirm = async () => {
    setIsOpen(false)
    if (selectedAsset) {
      toast.promise(removeTrackedAsset(selectedAsset), {
        loading: 'Updating token info...',
        success: () => 'Token removed!',
        error: (e) => `Error removing token: ${e.toString()}`,
      })
    }
    setSelectedAsset(null)
  }
  return (
    <div className={`modal text-white ${isOpen && 'modal-open'}`}>
      <div className='modal-box relative'>
        <figure
          className='absolute cursor-pointer top-6 right-6'
          onClick={() => setIsOpen(false)}
        >
          <Image src='/x.svg' alt='x button' height={20} width={20} />
        </figure>
        <h3 className='font-bold text-lg mb-4'>
          Remove a previously added asset
        </h3>
        <div className='flex flex-col gap-4'>
          <select
            value={selectedAsset?.toString() ?? 'initial'}
            onChange={(e) =>
              setSelectedAsset(Asset.fromAssetId(e.target.value))
            }
            className='select select-bordered select-md'
          >
            <option disabled value='initial'>
              Select an asset to remove
            </option>
            {removableAssets.map((asset) => (
              <option value={asset.toString()} key={asset.toString()}>
                {asset.symbol}
              </option>
            ))}
          </select>
        </div>
        <div className='modal-action'>
          <button
            onClick={handleConfirm}
            disabled={!selectedAsset}
            className={'btn btn-success'}
          >
            Confirm
          </button>
          <button className='btn btn-error' onClick={() => setIsOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
