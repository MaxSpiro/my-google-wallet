import { Amount, Asset } from 'lib/entities'
import { useFiat } from 'lib/hooks/useFiat'
import { useWallet } from 'lib/hooks/useWallet'
import { useStore } from 'lib/zustand'
import { useState } from 'react'
import { Address } from './Address'
import { AddTokenModal } from './modals/AddTokenModal'
import { RemoveTokenModal } from './modals/RemoveTokenModal'
import { SidebarMode } from './Sidebar'

export const WalletInfo = ({ mode }: { mode: SidebarMode }) => {
  const {
    isConnected,
    connectGoogle,
    getMaxBalance,
    getAddress,
    refreshBalances,
  } = useWallet()
  const trackedAssets = useStore((state) => state.trackedAssets)
  const assetToBalanceAddress: Record<
    string,
    {
      balance: Amount
      address: string
    }
  > = {}
  trackedAssets.forEach((asset) => {
    const address = getAddress(asset.chain)
    const balance = getMaxBalance(asset)
    assetToBalanceAddress[asset.toString()] = { balance, address }
  })

  const { getAssetPriceInUsd } = useFiat()

  const [, rerender] = useState(0) // hacky way to rerender on refresh balances since I don't want to keep balances in state
  const handleRefreshBalances = async () => {
    await refreshBalances()
    rerender(Math.random())
  }

  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false)
  const [isRemoveTokenModalOpen, setIsRemoveTokenModalOpen] = useState(false)

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
        {trackedAssets.map((asset) => {
          const balance = assetToBalanceAddress[asset.toString()].balance
          const address = assetToBalanceAddress[asset.toString()].address
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
      <button onClick={handleRefreshBalances} className='btn btn-primary'>
        Refresh all balances
      </button>
      <div className='flex gap-8 justify-around items-center'>
        <button
          onClick={() => setIsAddTokenModalOpen(true)}
          className='btn btn-success w-5/12'
        >
          Add token
        </button>
        <button
          onClick={() => setIsRemoveTokenModalOpen(true)}
          className='btn btn-error w-5/12'
        >
          Remove token
        </button>
      </div>
      <AddTokenModal
        isOpen={isAddTokenModalOpen}
        setIsOpen={setIsAddTokenModalOpen}
      />
      <RemoveTokenModal
        isOpen={isRemoveTokenModalOpen}
        setIsOpen={setIsRemoveTokenModalOpen}
      />
    </>
  )
}
