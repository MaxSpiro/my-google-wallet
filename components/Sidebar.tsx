/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { WalletInfo } from './WalletInfo'
import { useAppState } from 'lib/overmind'
import Image from 'next/image'

export enum SidebarMode {
  Balances = 'balances',
  Addresses = 'addresses',
}

export const Sidebar = () => {
  const {
    wallet: { isConnected },
  } = useAppState()

  const [mode, setMode] = useState<SidebarMode>(SidebarMode.Balances)

  if (!isConnected) {
    return (
      <div className='col-span-3 flex flex-col gap-4 py-2 px-6 bg-base-300 font-body text-primary-content'>
        <h1 className='font-semibold text-3xl text-center'>Log in first</h1>
      </div>
    )
  }

  return (
    <div className='flex flex-col col-span-3 pt-2 pb-6 px-6 max-h-[92vh] justify-between font-body text-primary-content'>
      <div className='flex flex-col gap-4   bg-base-300 '>
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
      <div className='flex gap-2 items-center'>
        <h2>Send me feedback</h2>
        <a
          href='https://discordapp.com/users/219743175722532865'
          target='_blank'
          className='h-8 flex items-center w-8 p-[4px] relative rounded-full bg-blue-600'
          rel='noreferrer'
        >
          <img
            alt='discord logo'
            src='https://assets-global.website-files.com/6257adef93867e50d84d30e2/62595384f934b806f37f4956_145dc557845548a36a82337912ca3ac5.svg'
          />
        </a>
        <a
          href='https://www.instagram.com/maxspiri/'
          target='_blank'
          className='relative h-8 w-8 bg-white rounded-full'
          rel='noreferrer'
        >
          <Image src='/instagram.svg' alt='instagram logo' layout='fill' />
        </a>
      </div>
    </div>
  )
}
