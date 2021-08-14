export type Payment = import('@tezospayments/common/models/payment').Payment;

export const enum PaymentUrlType {
  MinifiedBase64 = 0,
  Base64 = 1
}

export const enum SigningType {
  ApiSecretKey = 0,
  Wallet = 1
}
