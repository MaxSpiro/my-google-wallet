import { Context } from '..'
import { web3auth } from 'lib/services/web3auth'
import toast from 'react-hot-toast'
import { Amount, Asset } from 'lib/entities'
import { TxParams } from 'lib/types'

export const handleConnectGoogle = async ({
  state,
  effects,
  actions,
}: Context) => {
  await toast.promise(
    web3auth.connect(state.supportedAssets.map((a) => a.chain)),
    {
      loading: 'Connecting...',
      success: 'Connected!',
      error: 'Error connecting',
    },
  )
  state.wallet.isConnected = true
  state.wallet.wallet = web3auth
  state.wallet.userInfo = web3auth.userInfo
}

export const handleDisconnect = async ({
  state,
  effects,
  actions,
}: Context) => {
  await toast.promise(web3auth.disconnect(), {
    loading: 'Logging out...',
    success: 'Logged out!',
    error: 'Error logging out',
  })
  state.wallet.isConnected = false
  state.wallet.wallet = null
}

export const getMaxBalance = (
  { state, effects, actions }: Context,
  asset: Asset,
) => {
  const { isConnected, wallet } = state.wallet
  if (isConnected && wallet) {
    const balance = wallet.getBalance(asset)
    return balance
  }
  return Amount.fromBaseAmount(0, 8)
}

export const getAddressByChain = ({ state }: Context, chain: string) => {
  return state.wallet.wallet?.getAddress(chain) ?? ''
}

export const verifyAddress = async (
  { state }: Context,
  { address, chain }: { address: string; chain: string },
) => {
  return state.wallet.wallet?.verifyAddress(address, chain)
}

export const refreshBalances = async ({ state }: Context) => {
  if (!state.wallet.wallet) {
    toast.error('Wallet not connected')
    return
  }
  await toast.promise(state.wallet.wallet.loadAllBalances(), {
    loading: 'Refreshing balances...',
    success: 'Balances up to date!',
    error: 'Error refreshing balances',
  })
}

export const signAndSendTransaction = async (
  { state }: Context,
  txParams: TxParams,
) => {
  if (!state.wallet.wallet) {
    toast.error('Wallet not connected')
    return
  }
  await toast.promise(state.wallet.wallet.signAndSendTransaction(txParams), {
    loading: 'Sending transaction...',
    success: 'Transaction sent!',
    error: 'Error sending transaction',
  })
}

export const getPrivateKey = ({ state }: Context) => {
  return state.wallet.isConnected ? state.wallet.wallet?.exposePrivateKey() : ''
}
