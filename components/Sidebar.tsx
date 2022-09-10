import { useState } from 'react'
import { WalletInfo } from './WalletInfo'
import { useAppState } from 'lib/overmind'

export enum SidebarMode {
  Balances = 'balances',
  Addresses = 'addresses',
}

export const Sidebar = () => {
  const {
    wallet: { isConnected },
  } = useAppState()
  console.log('rerendering sidebar')
  const [mode, setMode] = useState<SidebarMode>(SidebarMode.Balances)
  if (!isConnected) {
    return (
      <div className='col-span-3 flex flex-col gap-4 py-2 px-6 bg-base-300 font-body text-primary-content'>
        <h1 className='font-semibold text-3xl text-center'>Log in first</h1>
      </div>
    )
  }

  return (
    <div className='col-span-3 flex flex-col gap-4 py-2 px-6 bg-base-300 font-body text-primary-content'>
      <h1 className='font-semibold text-3xl text-center'>
        <span
          onClick={() => setMode(SidebarMode.Balances)}
          className={`${
            mode === 'balances' ? '' : 'text-primary-focus'
          } cursor-pointer`}
        >
          Balances
        </span>{' '}
        /{' '}
        <span
          onClick={() => setMode(SidebarMode.Addresses)}
          className={`${
            mode === 'addresses' ? '' : 'text-primary-focus'
          } cursor-pointer`}
        >
          Addresses
        </span>
      </h1>
      <WalletInfo mode={mode} />
    </div>
  )
}
