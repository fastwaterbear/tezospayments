export type Payment = import('@tezospayments/common').Payment & {
  readonly urls: string;
};

export const enum PaymentUrlType {
  MinifiedBase64 = 0,
  Base64 = 1
}

export const enum SigningType {
  ApiSecretKey = 0,
  Wallet = 1
}
