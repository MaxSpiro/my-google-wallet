import { Amount, Asset } from '../../entities'
import { TxParams, Network } from '../types'
import Web3 from 'web3'
import { Account } from 'web3-core'
import { AbiItem } from 'web3-utils'

import { erc20MinAbi as minABI } from '../constants'
import { IWalletProvider } from '../types'

export class EVMProvider implements IWalletProvider {
  public nativeAsset
  private DECIMAL = 18

  private address: string = ''
  private balance: Amount = Amount.fromBaseAmount(0, 8)

  private web3: Web3
  private account: Account

  constructor(
    private privateKey: string,
    private network: Network,
    chain: string,
    { mainnet, testnet }: { mainnet: string; testnet: string },
  ) {
    this.nativeAsset = (() => {
      switch (chain) {
        case 'BSC':
          return new Asset('BSC', 'BNB')
        case 'MATIC':
          return Asset.MATIC()
        default:
          return Asset.ETH()
      }
    })()
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        network === 'testnet' ? testnet : mainnet,
      ),
    )
    this.account = this.web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`)
    this.web3.eth.defaultAccount = this.address = this.account.address
  }

  init = async () => {
    await this.updateBalance()
  }

  updateBalance = async () => {
    this.balance = Amount.fromBaseAmount(
      await this.web3.eth.getBalance(this.address),
      this.DECIMAL,
    )
  }

  getAddress = (): string => this.account.address
  getBalance = (): Amount => this.balance

  getERC20Balance = async (asset: Asset): Promise<Amount> => {
    const contract = new this.web3.eth.Contract(
      minABI as AbiItem[],
      asset.address,
    )
    const balance = await contract.methods.balanceOf(this.address).call()
    return Amount.fromBaseAmount(balance, this.DECIMAL)
  }

  signMessage = async (message: string) => {
    const signRes = await this.account.sign(message)
    return signRes.signature
  }

  signAndSendTransaction = async (txParams: TxParams) => {
    try {
      const signedTx = await this.signTransaction(txParams)
      if (!signedTx || !signedTx.rawTransaction) {
        throw Error('error signing transaction')
      }
      const txRes = await this.web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
      )
      return txRes
    } catch (error) {
      console.error('error', error)
    }
  }

  signTransaction = async (txParams: TxParams) => {
    try {
      const { to, gasPrice, gasLimit: gas, memo, value } = txParams
      const baseValue = value.baseAmount.toNumber()
      const txRes = await this.account.signTransaction({
        to,
        value: baseValue,
        gasPrice,
        gas,
        data: memo,
      })
      return txRes
    } catch (error) {
      console.error('error', error)
    }
  }
  verifyAddress = async (address: string): Promise<boolean> => {
    try {
      const res = await this.web3.eth.getBalance(address)
      return res !== undefined
    } catch (e) {
      return false
    }
  }
}
