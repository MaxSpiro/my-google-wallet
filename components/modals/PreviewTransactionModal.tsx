import { getTxExplorerUrl } from 'lib/helpers/explorer'
import { useFiat } from 'lib/hooks/useFiat'
import { useSend } from 'lib/hooks/useSend'
import { useWallet } from 'lib/hooks/useWallet'
import toast from 'react-hot-toast'
import Image from 'next/image'

export const PreviewTransactionModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (b: boolean) => void
}) => {
  const { asset, amount, fee, recipient, generateTransaction } = useSend()
  const { getAssetPriceInUsd } = useFiat()
  const { getMaxBalance } = useWallet()
  const amountInUsd = getAssetPriceInUsd(asset, amount)
  const feeInUsd = getAssetPriceInUsd(asset, fee)
  const balance = getMaxBalance(asset)
  const balanceInUsd = getAssetPriceInUsd(asset, balance)
  const endingBalance = balance.sub(fee).sub(amount)
  const endingBalanceInUsd = getAssetPriceInUsd(asset, endingBalance)

  const handleConfirm = async () => {
    setIsOpen(false)
    await toast.promise(
      generateTransaction(),
      {
        loading: 'Sending...',
        success: (txHash) => (
          <div>
            Transaction sent! View it{' '}
            <a
              target='_blank'
              className='text-blue-600 underline'
              href={getTxExplorerUrl(asset, txHash)}
              rel='noreferrer'
            >
              here
            </a>
          </div>
        ),
        error: (e) => `Error sending transaction: ${e.toString()}`,
      },
      {
        success: {
          duration: 8000,
        },
      },
    )
  }

  const isTransactionValid = endingBalance.gt(0)
  return (
    <div className={`modal text-white ${isOpen && 'modal-open'}`}>
      <div className='modal-box relative'>
        <figure
          className='absolute cursor-pointer top-6 right-6'
          onClick={() => setIsOpen(false)}
        >
          <Image src='/x.svg' alt='x button' height={20} width={20} />
        </figure>
        <h3 className='font-bold text-2xl'>Preview Transaction</h3>
        <ul className='gap-2 p-2 flex flex-col'>
          <p>
            Sending {amount.assetAmount.toNumber()} {asset.symbol} (
            <span className='text-primary-content'>${amountInUsd}</span>) to{' '}
            <span className='text-secondary-focus'>{recipient}</span>
          </p>
          <p>
            Estimated fee: {fee.assetAmount.toNumber().toFixed(4)}{' '}
            {asset.symbol} (
            <span className='text-primary-content'>${feeInUsd}</span>)
          </p>
          <div className='divider' />
          <div className='flex justify-between items-center'>
            <div>
              <p>Balance before:</p>
              <p>
                {balance.assetAmount.toNumber()} {asset.symbol} (
                <span className='text-primary-content'>${balanceInUsd}</span>)
              </p>
            </div>
            <div>
              <p>Balance after:</p>
              <p>
                {endingBalance.assetAmount.toNumber()} {asset.symbol} (
                <span className='text-primary-content'>
                  ${endingBalanceInUsd}
                </span>
                )
              </p>
            </div>
          </div>
          {!isTransactionValid && (
            <p className='text-error mt-2 text-center'>
              Transaction is invalid
            </p>
          )}
        </ul>
        <button
          onClick={handleConfirm}
          disabled={!isTransactionValid}
          className='mt-6 btn btn-primary w-full'
        >
          Confirm Transaction
        </button>
      </div>
    </div>
  )
}
