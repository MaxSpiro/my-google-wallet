import { Asset } from 'lib/entities'
import { useStore } from 'lib/zustand'

export const SelectAssetModal = ({
  setAsset,
  isOpen,
  setIsOpen,
}: {
  setAsset: (asset: Asset) => void
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}) => {
  const trackedAssets = useStore((state) => state.trackedAssets)

  return (
    <div className={`modal text-white ${isOpen && 'modal-open'}`}>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Select an native asset to send</h3>
        <ul className='gap-2 flex flex-col'>
          {trackedAssets.map((asset) => {
            return (
              <li key={asset.symbol}>
                <a
                  className='cursor-pointer'
                  onClick={() => {
                    setAsset(asset)
                    setIsOpen(false)
                  }}
                >
                  {asset.symbol}
                </a>
              </li>
            )
          })}
        </ul>
        <div className='modal-action'>
          <a onClick={() => setIsOpen(false)} className='btn'>
            Confirm
          </a>
        </div>
      </div>
    </div>
  )
}
