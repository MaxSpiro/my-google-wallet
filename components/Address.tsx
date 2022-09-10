import { useEffect, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getExplorerUrl } from 'lib/helpers/explorer'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Asset } from 'lib/entities'

export const Address = ({
  address,
  asset,
  expanded = false,
  className = '',
}: {
  address: string
  asset: Asset
  expanded?: boolean
  className?: string
}) => {
  const [compressed, setCompressed] = useState(!expanded)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    toast.success('Copied to clipboard')
    setCopied(true)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [copied])

  const formattedAddress = compressed
    ? address.slice(0, 6) + '...' + address.slice(-4)
    : address
  return (
    <span className='flex gap-2 items-center'>
      <span
        onClick={() => setCompressed((prev) => !prev)}
        className={`${className} cursor-pointer`}
      >
        {formattedAddress}
      </span>
      <CopyToClipboard text={address} onCopy={handleCopy}>
        <span className='cursor-pointer'>
          <Clippy
            className={`${copied ? 'hidden' : 'block'}`}
            css={{
              color: 'gray',
              position: 'absolute',
              top: 0,
              left: 0,
              strokeDasharray: 50,
              strokeDashoffset: copied ? -50 : 0,
              transition: 'all 300ms ease-in-out',
            }}
          />
          <Check
            className={`${copied ? 'block' : 'hidden'}`}
            css={{
              color: 'green',
              position: 'absolute',
              top: 0,
              left: 0,
              strokeDasharray: 50,
              strokeDashoffset: copied ? 0 : -50,
              transition: 'all 300ms ease-in-out',
            }}
          />
        </span>
      </CopyToClipboard>
      <a
        className='flex justify-center items-center'
        href={getExplorerUrl(asset, address)}
        target='_blank'
        rel='noreferrer'
      >
        <Image src='/globe.svg' width={20} height={20} alt='globe icon' />
      </a>
    </span>
  )
}

function Clippy(props: any) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M5.75 4.75H10.25V1.75H5.75V4.75Z' />
      <path d='M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379' />
    </svg>
  )
}

function Check(props: any) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M13.25 4.75L6 12L2.75 8.75' />
    </svg>
  )
}
