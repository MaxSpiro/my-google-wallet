export class Asset {
  public readonly chain: string

  public readonly symbol: string

  private assetId: string

  public address: string

  public decimal: number

  public static BTC(): Asset {
    return new Asset('BTC', 'BTC').setDecimal(8)
  }

  public static ETH(): Asset {
    return new Asset('ETH', 'ETH').setDecimal(18)
  }

  public static LTC(): Asset {
    return new Asset('LTC', 'LTC').setDecimal(8)
  }

  public static BCH(): Asset {
    return new Asset('BCH', 'BCH').setDecimal(8)
  }

  public static DOGE(): Asset {
    return new Asset('DOGE', 'DOGE').setDecimal(8)
  }

  public static MATIC(): Asset {
    return new Asset('POLYGON', 'MATIC').setDecimal(18)
  }

  public static BSC(): Asset {
    return new Asset('BSC', 'BNB').setDecimal(18)
  }

  public static getNativeAsset(chain: string): Asset {
    if (chain === 'BSC') {
      return Asset.BSC()
    }
    if (chain === 'MATIC') {
      return Asset.MATIC()
    }
    return new Asset(chain, chain).setDecimal(Asset.getDecimalByChain(chain))
  }

  public static getDecimalByChain(chain: string): number {
    if (chain === 'ETH' || chain === 'MATIC') {
      return 18
    }
    return 8
  }

  public static fromAssetId(assetId: string): Asset | null {
    // "ETH.AAVE-0X7FC66500C84A76AD7E9C93437BFC5AC33E2DDAE9"
    const [asset, address] = assetId.split('-')
    const [chain, symbol] = asset.split('.')
    return new Asset(chain, symbol).setAddress(address).setDecimal(this.getDecimalByChain(chain))
  }
  constructor(chain: string, symbol: string) {
    this.chain = chain
    this.symbol = symbol
    this.assetId = `${this.chain}.${this.symbol}`
    this.address = ''
    this.decimal = 8
  }

  public setDecimal = (decimal: number) => {
    this.decimal = decimal
    return this
  }

  public setAddress = (address: string) => {
    this.address = address
    this.assetId = `${this.chain}.${this.symbol}-${address}`
    return this
  }

  /**
   * convert asset entity to string
   * @returns L1 asset -> btc.btc, Synth asset -> btc/btc
   */
  toString(): string {
    return `${this.chain}.${this.symbol}${
      !!this.address ? `-${this.address}` : ''
    }`
  }

  // full compare chain, symbol, synth
  eq(asset: Asset): boolean {
    return (
      this.chain === asset.chain &&
      this.symbol.toUpperCase() === asset.symbol.toUpperCase()
    )
  }
}
