const networksInternal = {
  main: {
    id: 'NetXdQprcVkpaWU',
    name: 'main',
  },
  florence: {
    id: 'NetXxkAx4woPLyu',
    name: 'florence',
  },
  edo2net: {
    id: 'NetXSgo1ZT2DRUG',
    name: 'edo2net',
  },
  granadanet: {
    id: 'NetXz969SFaFn8k',
    name: 'granadanet',
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

export const networks: Networks = networksInternal;
