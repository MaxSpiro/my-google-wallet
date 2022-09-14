import { Amount, Asset } from 'lib/entities'
import {
  fetchAssetPrices,
  fetchSingleAssetPrice,
} from 'lib/proxies/getAssetPrices'
import { IWallet } from 'lib/types'
import create from 'zustand'

type State = {
  assetPricesInUsd: Record<string, string>
  fetchInitialAssetPrices: () => Promise<void>
  fetchSingleAssetPrice: (asset: Asset) => Promise<string>
  supportedAssets: Asset[]
  addSupportedAsset: (asset: Asset) => void
  appLoading: boolean
  wallet: IWallet | null
  setWallet: (wallet: IWallet | null) => Promise<void> | void
  userInfo: any
  swap: {
    inputAsset: Asset
    outputAsset: Asset
    inputAmount: Amount
    outputAmount: Amount
    fee: Amount
    setInputAsset: (asset: Asset) => void
    setOutputAsset: (asset: Asset) => void
    setInputAmount: (amount: Amount) => void
    setOutputAmount: (amount: Amount) => void
    setFee: (amount: Amount) => void
  }
  send: {
    asset: Asset
    amount: Amount
    recipient: string
    fee: Amount
    setAsset: (asset: Asset) => void
    setAmount: (amount: Amount) => void
    setRecipient: (recipient: string) => void
    setFee: (amount: Amount) => void
  }
  receive: {
    asset: Asset
    setAsset: (asset: Asset) => void
  }
}

const useStore = create<State>()((set, get) => ({
  assetPricesInUsd: {},
  fetchInitialAssetPrices: async () => {
    const assetPricesInUsd = await fetchAssetPrices(get().supportedAssets)
    set({ assetPricesInUsd })
    set({ appLoading: false })
  },
  fetchSingleAssetPrice: async (asset: Asset) => {
    const assetPriceInUsd = await fetchSingleAssetPrice(asset)
    set({ assetPricesInUsd: { ...get().assetPricesInUsd, assetPriceInUsd } })
    return assetPriceInUsd
  },
  supportedAssets: [
    Asset.ETH(),
    Asset.BTC(),
    Asset.LTC(),
    Asset.BCH(),
    Asset.ATOM(),
    Asset.DOGE(),
    Asset.MATIC(),
  ],
  addSupportedAsset: (asset) => {
    set({ supportedAssets: [...get().supportedAssets, asset] })
  },
  appLoading: true,
  wallet: null,
  setWallet: (wallet: IWallet | null) => set({ wallet }),
  userInfo: null,
  swap: {
    inputAsset: Asset.getNativeAsset('BTC'),
    outputAsset: Asset.getNativeAsset('ETH'),
    inputAmount: Amount.fromAssetAmount(0, 8),
    outputAmount: Amount.fromAssetAmount(0, 8),
    fee: Amount.fromAssetAmount(0, 8),
    setInputAsset: (asset: Asset) =>
      set((state) => ({ swap: { ...state.swap, inputAsset: asset } })),
    setOutputAsset: (asset: Asset) =>
      set((state) => ({ swap: { ...state.swap, outputAsset: asset } })),
    setInputAmount: (amount: Amount) =>
      set((state) => ({ swap: { ...state.swap, inputAmount: amount } })),
    setOutputAmount: (amount: Amount) =>
      set((state) => ({ swap: { ...state.swap, outputAmount: amount } })),
    setFee: (amount: Amount) =>
      set((state) => ({ swap: { ...state.swap, fee: amount } })),
  },
  send: {
    asset: Asset.ETH(),
    amount: Amount.fromAssetAmount(0, 8),
    recipient: '',
    fee: Amount.fromAssetAmount(0, 8),
    setAsset: (asset: Asset) =>
      set((state) => ({ send: { ...state.send, asset } })),
    setAmount: (amount: Amount) =>
      set((state) => ({ send: { ...state.send, amount } })),
    setRecipient: (recipient: string) =>
      set((state) => ({ send: { ...state.send, recipient } })),
    setFee: (fee: Amount) => set((state) => ({ send: { ...state.send, fee } })),
  },
  receive: {
    asset: Asset.ETH(),
    setAsset: (asset: Asset) =>
      set((state) => ({ receive: { ...state.receive, asset } })),
  },
}))

export { useStore }
