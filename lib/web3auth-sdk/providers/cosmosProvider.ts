import { Sha256, Secp256k1 } from '@cosmjs/crypto'
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'
import { Amount, Asset } from '../../entities'
import { TxParams, Network } from '../types'

import { IWalletProvider } from '../types'

export class ATOMProvider implements IWalletProvider {
  public nativeAsset = Asset.ATOM()
  private DECIMAL = 6

  private address: string = ''
  private balance: Amount = Amount.fromBaseAmount(0, 6)

  private signer: DirectSecp256k1Wallet | undefined
  private client: SigningStargateClient | undefined

  private rpcUrl: string

  constructor(private privateKey: string, private network: Network) {
    this.rpcUrl =
      network === 'testnet'
        ? 'rpc.sentry-01.theta-testnet.polypore.xyz:26657'
        : 'https://cosmoshub-4--rpc--full.datahub.figment.io/apikey/1fdb2081966af7be9dc53ac5f463ccd5'
  }

  init = async () => {
    this.signer = await DirectSecp256k1Wallet.fromKey(
      Uint8Array.from(Buffer.from(this.privateKey, 'hex')),
      'cosmos',
    )
    this.address = (await this.signer.getAccounts())[0].address
    this.client = await SigningStargateClient.connectWithSigner(
      this.rpcUrl,
      this.signer,
    )
    await this.updateBalance()
  }

  updateBalance = async () => {
    if (!this.client) {
      return
    }
    this.balance = Amount.fromBaseAmount(
      Number((await this.client.getBalance(this.address, 'uatom')).amount),
      this.DECIMAL,
    )
  }

  getAddress = (): string => this.address
  getBalance = (): Amount => this.balance

  signTransaction = async (txParams: TxParams): Promise<any> => {
    if (!this.client) {
      return Promise.reject('client is not initialized')
    }
    const { to, value, memo, gasLimit, gasPrice } = txParams
    const signedTx = await this.client.sign(
      this.address,
      [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: this.address,
            toAddress: to,
            amount: [
              {
                denom: 'uatom',
                amount: value.baseAmount.toNumber(),
              },
            ],
          },
        },
      ],
      {
        amount: [
          {
            denom: 'uatom',
            amount: gasPrice ?? '500',
          },
        ],
        gas: gasLimit ?? '200000',
      },
      memo ?? '',
    )
    return signedTx
  }

  signAndSendTransaction = async (txParams: TxParams): Promise<any> => {
    if (!this.client) {
      return Promise.reject('client is not initialized')
    }
    const { to, value, memo, gasLimit, gasPrice } = txParams
    const txReceipt = await this.client.signAndBroadcast(
      this.address,
      [
        {
          typeUrl: '/cosmos.bank.v1beta1.MsgSend',
          value: {
            fromAddress: this.address,
            toAddress: to,
            amount: [
              {
                denom: 'uatom',
                amount: value.baseAmount.toNumber(),
              },
            ],
          },
        },
      ],
      {
        amount: [
          {
            denom: 'uatom',
            amount: gasPrice ?? '500',
          },
        ],
        gas: gasLimit ?? '200000',
      },
      memo ?? '',
    )
    return txReceipt
  }

  signMessage = async (message: string) => {
    const messageHash = new Sha256(
      Uint8Array.from(Buffer.from(message, 'utf-8')),
    ).digest()
    const signature = await Secp256k1.createSignature(
      messageHash,
      Uint8Array.from(Buffer.from(this.privateKey, 'hex')),
    )
    return Buffer.from(signature.toDer()).toString('hex') // signature.toDer or signature.toFixedLength
  }

  verifyAddress = async (address: string): Promise<boolean> => {
    try {
      const res = await this.client?.getBalance(address, 'uatom')
      return res !== undefined
    } catch (e) {
      return false
    }
  }
}
