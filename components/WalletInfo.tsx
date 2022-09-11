import { Asset } from 'lib/entities'
import { useActions, useAppState } from 'lib/overmind'
import { Address } from './Address'
import { SidebarMode } from './Sidebar'

export const WalletInfo = ({ mode }: { mode: SidebarMode }) => {
  const {
    supportedAssets,
    wallet: { isConnected },
  } = useAppState()
  const {
    wallet: {
      handleConnectGoogle,
      getAddressByChain,
      getMaxBalance,
      refreshBalances,
    },
    getAssetPriceInUsd,
  } = useActions()

  if (!isConnected) {
    return (
      <button className='btn btn-primary' onClick={handleConnectGoogle}>
        Log in to view balances & addresses
      </button>
    )
  }

  return (
    <>
      <ul>
        {supportedAssets.map((asset) => {
          const balance = getMaxBalance(asset)
          const address = getAddressByChain(asset.chain)
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
                          ${getAssetPriceInUsd({ asset, amount: balance })}
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
