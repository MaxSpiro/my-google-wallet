import { Amount, Asset } from 'lib/entities'
import { useFiat } from 'lib/hooks/useFiat'
import { useWallet } from 'lib/hooks/useWallet'
import { useStore } from 'lib/zustand'
import { Address } from './Address'
import { SidebarMode } from './Sidebar'

export const WalletInfo = ({ mode }: { mode: SidebarMode }) => {
  const {
    isConnected,
    connectGoogle,
    getMaxBalance,
    getAddress,
    refreshBalances,
  } = useWallet()
  const supportedAssets = useStore((state) => state.supportedAssets)

  const { getAssetPriceInUsd } = useFiat()

  if (!isConnected) {
    return (
      <button className='btn btn-primary' onClick={connectGoogle}>
        Log in to view balances & addresses
      </button>
    )
  }

  return (
    <>
      <ul>
        {supportedAssets.map((asset) => {
          const balance = getMaxBalance(asset)
          const address = getAddress(asset.chain)
          return (
            <li key={asset.symbol} className='my-2'>
              <div className='flex items-center gap-2 flex-wrap'>
                <div className='text-xl font-semibold text-secondary-focus'>
                  {' '}
                  {asset.symbol}:{' '}
                </div>
                {mode === SidebarMode.Balances ? (
                  balance.eq(0) ? (
                    'Empty!'
                  ) : (
                    <>
                      {balance.assetAmount.toNumber().toString().includes('.')
                        ? balance.assetAmount.toNumber()
                        : balance.assetAmount.toNumber().toFixed(1)}{' '}
                      <span>
                        (
                        <span className='text-primary-content'>
                          ${getAssetPriceInUsd(asset, balance)}
                        </span>
                        )
                      </span>
                    </>
                  )
                ) : (
                  address && <Address address={address} asset={asset} />
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <button onClick={refreshBalances} className='btn btn-primary'>
        Refresh all balances
      </button>
    </>
  )
}
