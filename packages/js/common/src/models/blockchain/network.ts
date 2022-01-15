const networksInternal = {
  mainnet: {
    id: 'NetXdQprcVkpaWU',
    name: 'mainnet',
  },
  granadanet: {
    id: 'NetXz969SFaFn8k',
    name: 'granadanet',
  },
  hangzhounet: {
    id: 'NetXZSsxBpMQeAT',
    name: 'hangzhounet'
  }
} as const;

interface NetworkInternal {
  readonly id: string;
  readonly name: string;
}

type Networks = {
  readonly [P in keyof typeof networksInternal]: (typeof networksInternal)[P] extends NetworkInternal & {
    readonly name: P;
  }
  ? (typeof networksInternal)[P]
  : never
};

export type Network = Networks[keyof Networks];
export interface CustomNetwork {
  readonly id?: string;
  readonly name: string;
}

export const networks: Networks = networksInternal;
export const networksCollection = Object.values(networksInternal);

export const networkIdRegExp = /^[a-zA-Z]\w*$/;
export const networkNameRegExp = networkIdRegExp;
