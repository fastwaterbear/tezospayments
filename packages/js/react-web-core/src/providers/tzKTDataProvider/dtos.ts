export interface ServiceDto {
  allowed_operation_type: string;
  allowed_tokens: {
    tez: boolean,
    assets: string[]
  };
  deleted: boolean;
  metadata: string;
  owner: string;
  paused: boolean
  version: string;
  signing_keys: {
    [publicKey: string]: { public_key: string; name: string | null }
  }
}

export interface ServicesBigMapKeyValuePairDto {
  key: string;
  value: string[]
}

export interface OperationAccountDto {
  address: string;
}

export interface OperationParameterDtoBase {
  entrypoint: string;
}

export interface SendPaymentParameterDto extends OperationParameterDtoBase {
  entrypoint: 'send_payment',
  value: {
    id: string;
    signature: string;
    asset_value: {
      value: string,
      token_id: string | null,
      token_address: string
    } | null;
  }
}

export interface SendDonationParameterDto extends OperationParameterDtoBase {
  entrypoint: 'send_donation',
  value: {
    payload: string,
    asset_value: {
      value: string,
      token_id: string | null,
      token_address: string
    } | null;
  }
}

export interface OperationDto {
  id: number;
  hash: string;
  type: 'endorsement' | 'ballot' | 'proposal' | 'activation' | 'double_baking' | 'double_endorsing'
  | 'nonce_revelation' | 'delegation' | 'origination' | 'transaction' | 'reveal'
  | 'migration' | 'revelation_penalty' | 'baking';
  status: 'applied' | 'failed' | 'backtracked' | 'skipped';
  timestamp: string;
  sender: OperationAccountDto;
  target: OperationAccountDto;
  amount: BigInt;
  parameter: SendPaymentParameterDto | SendDonationParameterDto;
}

export interface OperationWithDate extends OperationDto {
  date: Date;
}
