import { Asset } from 'lib/entities'
import { useActions, useAppState } from 'lib/overmind'

export enum AssetType {
  Output = 'Output',
  Input = 'Input',
  Send = 'Send',
  Receive = 'Receive',
}

export const SelectAssetModal = ({ assetType }: { assetType: AssetType }) => {
  const { supportedAssets } = useAppState()
  const {
    send: { setSendAsset },
    receive: { setReceiveAsset },
    swap: { setInputAsset, setOutputAsset },
  } = useActions()

  const handleSelectAsset = (asset: Asset) => {
    switch (assetType) {
      case AssetType.Input:
        setInputAsset(asset)
        break
      case AssetType.Output:
        setOutputAsset(asset)
        break
      case AssetType.Send:
        setSendAsset(asset)
        break
      case AssetType.Receive:
        setReceiveAsset(asset)
        break
    }
  }
  return (
    <div className='modal text-white' id={`select${assetType}AssetModal`}>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>Select an native asset to send</h3>
        <ul className='gap-2 flex flex-col'>
          {supportedAssets.map((asset) => {
            return (
              <li key={asset.symbol}>
                <a href='#' onClick={() => handleSelectAsset(asset)}>
                  {asset.symbol}
                </a>
              </li>
            )
          })}
        </ul>
        <div className='modal-action'>
          <a href='#' className='btn'>
            Confirm
          </a>
        </div>
      </div>
    </div>
  )
}