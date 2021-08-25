export type Payment = import('@tezospayments/common').Payment & {
  readonly url: string;
};

export enum PaymentUrlType {
  Base64 = 0
}

export enum SigningType {
  ApiSecretKey = 0,
  Wallet = 1,
  Custom = 2,
}
