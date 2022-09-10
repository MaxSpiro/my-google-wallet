import axios from 'axios'
import bitcore from 'bitcore-lib-cash'
import { Amount, Asset } from '../../entities'
import { Network, TxParams } from '../types'
import { haskoinMainnetUrl } from '../constants'

import { IWalletProvider } from '../types'

export class BCHProvider implements IWalletProvider {
  public nativeAsset = Asset.BCH()
  private DECIMAL = 8

  private balance: Amount = Amount.fromBaseAmount(0, this.DECIMAL)
  private address: string = ''
  private account: any

  private haskoinBaseUrl: string

  constructor(private privateKey: string, private network: Network) {
    this.network = network
    this.privateKey = privateKey
    this.haskoinBaseUrl = `${haskoinMainnetUrl}${
      network === 'testnet' ? 'test' : ''
    }`

    this.account = new bitcore.PrivateKey(this.privateKey, network)
    this.address = this.account.toAddress().toString()
  }

  init = async () => {
    await this.updateBalance()
  }

  updateBalance = async () => {
    const res = await axios.get(
      `${this.haskoinBaseUrl}/address/${this.address}/balance`,
    )
    this.balance = Amount.fromBaseAmount(
      Number(res.data.confirmed),
      this.DECIMAL,
    )
  }

  getAddress = (): string => this.address
  getBalance = (): Amount => this.balance

  signTransaction = async (txParams: TxParams) => {
    const { to, memo, value } = txParams

    const baseValue = value.baseAmount.toNumber()
    const fee = Number(
      txParams.fee ??
        Amount.fromAssetAmount(0.00002, this.DECIMAL).baseAmount.toNumber(),
    )

    const utxoData = (
      await axios.get(`${this.haskoinBaseUrl}/address/${this.address}/unspent`)
    ).data

    const utxos: bitcore.Transaction.UnspentOutput[] = utxoData.map(
      (utxo: any) =>
        bitcore.Transaction.UnspentOutput.fromObject({
          txId: utxo.txid,
          address: bitcore.Address.fromString(utxo.address),
          outputIndex: utxo.index,
          script: bitcore.Script.fromHex(utxo.pkscript),
          satoshis: utxo.value,
        }),
    )

    const tx = new bitcore.Transaction()
      .from(utxos)
      .fee(fee)
      .to(to, baseValue)
      .change(this.address)
    if (memo) {
      tx.addData(memo)
    }
    tx.sign(this.privateKey)

    if (
      baseValue + tx.getFee() >
      utxos.reduce((prev, curr) => prev + curr.satoshis, 0)
    ) {
      throw Error('not enough funds')
    }

    const txHex = tx.serialize()
    return txHex
  }

  signAndSendTransaction = async (txParams: TxParams) => {
    try {
      const txHex = await this.signTransaction(txParams)
      const res = await axios.post(
        `${this.haskoinBaseUrl}/transactions`,
        txHex,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        },
      )
      return res.data.txid
    } catch (error) {
      Promise.reject(error)
    }
  }

  signMessage = async (message: string) => {
    const toSign = new bitcore.Message(message)
    const signature = toSign.sign(this.account)
    return signature
  }

  verifyAddress = async (address: string): Promise<boolean> => {
    try {
      const res = await axios.get(
        `${this.haskoinBaseUrl}/address/${address}/balance`,
      )
      return res.status === 200
    } catch (e) {
      return false
    }
  }
}
