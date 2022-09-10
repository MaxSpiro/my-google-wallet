import BigNumber from 'bignumber.js'

export enum AmountType {
  BASE_AMOUNT,
  ASSET_AMOUNT,
}

export class Amount {
  public readonly assetAmount: BigNumber

  public readonly baseAmount: BigNumber

  public readonly decimal: number

  public static fromBaseAmount(
    amount: BigNumber.Value,
    decimal: number,
  ): Amount {
    return new Amount(amount, AmountType.BASE_AMOUNT, decimal)
  }

  public static fromAssetAmount(
    amount: BigNumber.Value,
    decimal: number,
  ): Amount {
    return new Amount(amount, AmountType.ASSET_AMOUNT, decimal)
  }

  constructor(
    amount: BigNumber.Value,
    type: AmountType = AmountType.BASE_AMOUNT,
    decimal: number,
  ) {
    this.decimal = decimal
    const decimalAmount = 10 ** decimal

    if (type === AmountType.BASE_AMOUNT) {
      this.baseAmount = new BigNumber(amount)
      this.assetAmount = this.baseAmount.dividedBy(decimalAmount)
    } else {
      this.assetAmount = new BigNumber(amount)
      this.baseAmount = this.assetAmount.multipliedBy(decimalAmount)
    }

    // remove decimal points for baseAmount
    this.baseAmount = new BigNumber(
      this.baseAmount.integerValue(BigNumber.ROUND_DOWN),
    )
  }

  get _0_AMOUNT() {
    return new Amount(0, AmountType.ASSET_AMOUNT, this.decimal)
  }

  add(amount: Amount): Amount {
    return new Amount(
      this.assetAmount.plus(amount.assetAmount),
      AmountType.ASSET_AMOUNT,
      this.decimal,
    )
  }

  sub(amount: Amount): Amount {
    return new Amount(
      this.assetAmount.minus(amount.assetAmount),
      AmountType.ASSET_AMOUNT,
      this.decimal,
    )
  }

  mul(value: BigNumber.Value | Amount): Amount {
    if (value instanceof Amount) {
      return new Amount(
        this.assetAmount.multipliedBy(value.assetAmount),
        AmountType.ASSET_AMOUNT,
        this.decimal,
      )
    }
    return new Amount(
      this.assetAmount.multipliedBy(value),
      AmountType.ASSET_AMOUNT,
      this.decimal,
    )
  }

  div(value: BigNumber.Value | Amount): Amount {
    if (value instanceof Amount) {
      return new Amount(
        this.assetAmount.dividedBy(value.assetAmount),
        AmountType.ASSET_AMOUNT,
        this.decimal,
      )
    }
    return new Amount(
      this.assetAmount.dividedBy(value),
      AmountType.ASSET_AMOUNT,
      this.decimal,
    )
  }

  gte(amount: Amount | BigNumber.Value): boolean {
    if (amount instanceof Amount) {
      return this.assetAmount.isGreaterThanOrEqualTo(amount.assetAmount)
    }

    return this.assetAmount.isGreaterThanOrEqualTo(amount)
  }

  gt(amount: Amount | BigNumber.Value): boolean {
    if (amount instanceof Amount) {
      return this.assetAmount.isGreaterThan(amount.assetAmount)
    }

    return this.assetAmount.isGreaterThan(amount)
  }

  lte(amount: Amount | BigNumber.Value): boolean {
    if (amount instanceof Amount) {
      return this.assetAmount.isLessThanOrEqualTo(amount.assetAmount)
    }

    return this.assetAmount.isLessThanOrEqualTo(amount)
  }

  lt(amount: Amount | BigNumber.Value): boolean {
    if (amount instanceof Amount) {
      return this.assetAmount.isLessThan(amount.assetAmount)
    }

    return this.assetAmount.isLessThan(amount)
  }

  eq(amount: Amount | BigNumber.Value): boolean {
    if (amount instanceof Amount) {
      return this.assetAmount.isEqualTo(amount.assetAmount)
    }

    return this.assetAmount.isEqualTo(amount)
  }

  toString(): string {
    return this.assetAmount.toFixed(this.decimal)
  }
}
