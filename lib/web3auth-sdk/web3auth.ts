import { IWallet, Network, TxParams, WalletOption } from '../types'
import { UserInfo } from './types'
import { Amount, Asset } from '../entities'
import { web3AuthApiKey } from '../config'
import { getWalletProvider } from './providers/walletProvider'
import { IWalletProvider } from './types'
import { Web3AuthCore } from '@web3auth/core'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

export class Web3AuthClient implements IWallet {
  private web3auth: Web3AuthCore

  network = Network.Testnet // default/fallback network

  walletType = WalletOption.Social

  userInfo: UserInfo | undefined = undefined

  private providers: Map<string, IWalletProvider> = new Map()

  private privateKey: string = ''

  isConnected = false

  supportedChains: string[] = []

  constructor(network: Network) {
    this.network = network
    const web3auth = new Web3AuthCore({
      clientId: web3AuthApiKey,
      chainConfig: { chainNamespace: 'other' },
    })
    const openloginAdapter = new OpenloginAdapter({
      adapterSettings: {
        network: 'mainnet',
        uxMode: 'popup',
      },
      loginSettings: {
        loginProvider: 'google',
      },
    })

    this.web3auth = web3auth.configureAdapter(openloginAdapter)
  }

  setNetwork = (network: Network) => {
    this.network = network
  }

  async connect(chains: string[]): Promise<IWallet> {
    this.supportedChains = chains
    let loggedIn = false
    if (this.web3auth.status === 'not_ready') {
      await this.web3auth.init()
    }
    if (this.web3auth.status === 'connected') {
      loggedIn = true
    }

    // can log in with any provider (google, facebook, etc.)
    const localProvider = loggedIn
      ? this.web3auth.provider
      : await this.web3auth.connectTo('openlogin', {
          loginProvider: 'google',
        })
    if (!localProvider || !this.web3auth.provider) {
      throw Error('failed to connect to local provider')
    }

    this.userInfo = (await this.web3auth.getUserInfo()) as UserInfo

    const privateKey = (await this.web3auth.provider.request({
      method: 'private_key',
    })) as string
    this.privateKey = privateKey

    // set each provider as chain client & init
    await Promise.all(
      chains.map(async (chain) => {
        const client = getWalletProvider(chain, privateKey, this.network)
        if (client) {
          this.providers.set(chain, client)
          await client.init()
        }
      }),
    )

    this.isConnected = true
    return this
  }

  exposePrivateKey(): string {
    return this.privateKey
  }

  async disconnect(): Promise<void> {
    await this.web3auth.logout()
    this.isConnected = false
  }

  getAddress(chain: string): string {
    const chainClient = this.getClientByChain(chain)
    return chainClient.getAddress()
  }

  getBalance(asset: Asset): Amount {
    const chainClient = this.getClientByChain(asset.chain)
    return chainClient.getBalance(asset)
  }

  async loadAllBalances(assets: Asset[]) {
    const promises: Promise<void>[] = []
    this.providers.forEach((provider) => {
      promises.push(provider.updateBalance(assets.filter((asset) => asset.chain === provider.nativeAsset.chain)))
    })
    await Promise.all(promises)
  }

  async signMessage(chain: string, message: string) {
    const chainClient = this.getClientByChain(chain)
    return chainClient?.signMessage(message)
  }

  async signTransaction(txParams: TxParams) {
    if (!this.supportedChains.find((chain) => chain === txParams.asset.chain)) {
      throw Error('unsupported asset for transaction')
    }
    // if(!(txParams.asset.chain in this.supportedChains)) evaluates to false ??? when chain is BTC...
    const chainClient = this.getClientByChain(txParams.asset.chain)
    const signedTx = await chainClient.signTransaction(txParams)
    return signedTx
  }

  async signAndSendTransaction(txParams: TxParams) {
    if (!this.supportedChains.find((chain) => chain === txParams.asset.chain)) {
      throw Error('unsupported asset for transaction')
    }
    const chainClient = this.getClientByChain(txParams.asset.chain)
    const txReceipt = await chainClient.signAndSendTransaction(txParams)
    return txReceipt
  }

  getClientByChain(chain: string): IWalletProvider {
    const provider = this.providers.get(chain)
    if (!provider) {
      throw Error('error retrieving provider')
    }
    return provider
  }

  isChainSupported = (chain: string): boolean => {
    return (
      this.supportedChains.find(
        (supportedChain) => supportedChain === chain,
      ) !== undefined
    )
  }

  verifyAddress = async (address: string, chain: string): Promise<boolean> => {
    const provider = this.providers.get(chain)
    if (!provider) {
      throw Error('unsupported chain')
    }
    return provider.verifyAddress(address)
  }
}
