import { Asset } from 'lib/entities'
import { useWallet } from 'lib/hooks/useWallet'
import { useStore } from 'lib/zustand'
import Image from 'next/image'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const AddTokenModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
}) => {
  const [supportedChains, trackedAssets, addTrackedAsset] = useStore(
    (store) => [
      store.supportedChains.filter((c) => c.supportsTokens),
      store.trackedAssets,
      store.addTrackedAsset,
    ],
  )
  const [network, setNetwork] = useState('initial')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const isFormComplete = tokenSymbol && tokenAddress && network !== 'initial'

  const handleConfirm = async () => {
    setIsOpen(false)
    const assetId = `${network}.${tokenSymbol}-${tokenAddress}`
    if (trackedAssets.some((a) => a.toString() === assetId)) {
      toast.error('Asset already tracked')
      return
    }
    const asset = Asset.fromAssetId(assetId)
    if (asset) {
      toast.promise(addTrackedAsset(asset), {
        loading: 'Fetching token info...',
        success: () => 'Token added!',
        error: (e) => `Error adding token: ${e.toString()}`,
      })
    } else {
      toast.error('Could not add token')
    }
    setNetwork('initial')
    setTokenSymbol('')
    setTokenAddress('')
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
        <h3 className='font-bold text-lg mb-4'>Track a new asset</h3>
        <div className='flex flex-col gap-4'>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className='select select-bordered select-md'
          >
            <option disabled value='initial'>
              Select a network
            </option>
            {supportedChains.map((chain) => (
              <option value={chain.name} key={chain.name}>
                {chain.name}
              </option>
            ))}
          </select>
          {network !== 'initial' && (
            <div className='flex items-center gap-2'>
              <label htmlFor='tokenAddress'>Token symbol:</label>
              <input
                name='tokenSymbol'
                type='text'
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className='input input-bordered'
              />
            </div>
          )}
          {network !== 'initial' && !!tokenSymbol && (
            <div className='flex items-center gap-2'>
              <label htmlFor='tokenAddress'>Token address:</label>
              <input
                name='tokenAddress'
                type='text'
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className='input input-bordered'
              />
            </div>
          )}
        </div>
        <div className='modal-action'>
          <a
            onClick={handleConfirm}
            className={`btn ${isFormComplete ? 'btn-primary' : ''}`}
          >
            Confirm
          </a>
        </div>
      </div>
    </div>
  )
}
