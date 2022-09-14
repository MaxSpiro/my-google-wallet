import { web3auth } from 'lib/services/web3auth'
import toast from 'react-hot-toast'
import { Amount, Asset } from 'lib/entities'
import { TxParams } from 'lib/types'
import { useStore } from 'lib/zustand'

export const useWallet = () => {
  const wallet = useStore((state) => state.wallet)
  const setWallet = useStore((state) => state.setWallet)
  const supportedAssets = useStore((state) => state.supportedAssets)

  const connectGoogle = async () => {
    if (wallet) {
      return
    }
    const web3 = await toast.promise(
      web3auth.connect(supportedAssets.map((a) => a.chain)),
      {
        loading: 'Connecting...',
        success: 'Connected!',
        error: 'Error connecting',
      },
    )
    setWallet(web3)
  }

  const disconnectWallet = async () => {
    await web3auth.disconnect()
    setWallet(null)
  }

  const signAndSendTransaction = async (txParams: TxParams) => {
    if (!wallet) {
      toast.error('Wallet not connected')
      return
    }
    await toast.promise(wallet.signAndSendTransaction(txParams), {
      loading: 'Sending...',
      success: 'Sent!',
      error: 'Error sending',
    })
  }

  const getMaxBalance = (asset: Asset) => {
    if (!wallet) {
      return Amount.fromAssetAmount(0, asset.decimal)
    }
    return wallet.getBalance(asset)
  }

  const getAddress = (chain: string) => {
    if (!wallet) {
      return ''
    }
    return wallet.getAddress(chain)
  }

  const verifyAddress = async (address: string, chain: string) => {
    if (!wallet) {
      return false
    }
    return wallet.verifyAddress(address, chain)
  }

  const refreshBalances = async () => {
    if (!wallet) {
      return
    }
    await toast.promise(wallet.loadAllBalances(), {
      loading: 'Refreshing balances...',
      success: 'Balances up to date!',
      error: 'Error refreshing balances',
    })
  }

  const getPrivateKey = () => {
    if (!wallet) {
      return ''
    }
    return wallet.exposePrivateKey()
  }

  const userInfo = wallet?.userInfo

  const isConnected = !!wallet

  return {
    userInfo,
    isConnected,
    connectGoogle,
    disconnectWallet,
    signAndSendTransaction,
    getMaxBalance,
    getAddress,
    verifyAddress,
    refreshBalances,
    getPrivateKey,
  }
}
