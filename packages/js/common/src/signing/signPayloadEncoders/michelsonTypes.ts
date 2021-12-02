import type { MichelsonType } from '@taquito/michel-codec';

export const contractPaymentInTezSignPayloadMichelsonType: MichelsonType = {
  prim: 'pair',
  args: [
    {
      prim: 'pair',
      args: [
        { prim: 'string' },
        { prim: 'address' }
      ]
    },
    { prim: 'mutez' }
  ]
};

export const contractPaymentInAssetSignPayloadMichelsonType: MichelsonType = {
  prim: 'pair',
  args: [
    {
      prim: 'pair',
      args: [
        {
          prim: 'pair',
          args: [
            { prim: 'string' },
            { prim: 'address' }
          ]
        },
        {
          prim: 'pair',
          args: [
            { prim: 'nat' },
            { prim: 'address' }
          ]
        }
      ]
    },
    {
      prim: 'option',
      args: [{ prim: 'nat' }]
    }
  ]
};
