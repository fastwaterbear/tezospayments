const contractAddressPrefixes = ['KT'] as const;
const implicitAddressPrefixes = ['tz1', 'tz2', 'tz3'] as const;
const addressPrefixes = [...contractAddressPrefixes, ...implicitAddressPrefixes] as const;

export const tezosInfo = {
  addressLength: 36,
  contractAddressPrefixes,
  implicitAddressPrefixes,
  addressPrefixes,
} as const;
