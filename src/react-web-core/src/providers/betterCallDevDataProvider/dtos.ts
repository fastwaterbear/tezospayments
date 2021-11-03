export type ServicesFactoryDto = [
  {
    prim: 'pair',
    type: 'namedtuple',
    name: '@pair_1',
    children: [
      {
        prim: 'address',
        type: 'address',
        name: 'administrator',
        value: string
      },
      {
        prim: 'address',
        type: 'address',
        name: 'factory_implementation',
        value: string
      },
      {
        prim: 'nat',
        type: 'nat',
        name: 'factory_implementation_version',
        value: string
      },
      {
        prim: 'bool',
        type: 'bool',
        name: 'paused',
        value: boolean
      },
      {
        prim: 'big_map',
        type: 'big_map',
        name: 'services',
        value: number
      }
    ]
  }
];

export type ServiceDto = [
  {
    prim: 'pair',
    type: 'namedtuple',
    name: '@pair_1',
    children: [
      {
        prim: 'nat',
        type: 'nat',
        name: 'allowed_operation_type',
        value: '1' | '2' | '3'
      },
      {
        prim: 'pair',
        type: 'namedtuple',
        name: 'allowed_tokens',
        children: [
          {
            prim: 'bool',
            type: 'bool',
            name: 'tez',
            value: boolean
          },
          {
            prim: 'set',
            type: 'set',
            name: 'assets'
          }
        ]
      },
      {
        prim: 'bool',
        type: 'bool',
        name: 'deleted',
        value: boolean
      },
      {
        prim: 'bytes',
        type: 'bytes',
        name: 'metadata',
        value: string
      },
      {
        prim: 'address',
        type: 'address',
        name: 'owner',
        value: string
      },
      {
        prim: 'bool',
        type: 'bool',
        name: 'paused',
        value: boolean
      },
      {
        prim: 'map',
        type: 'map',
        name: 'signing_keys',
        children?: SigningKeyDto[]
      },
      {
        prim: 'nat',
        type: 'nat',
        name: 'version',
        value: string
      }
    ]
  }
];

export type SigningKeyDto = {
  prim: 'pair',
  type: 'namedtuple',
  name: string,
  children: [
    {
      prim: 'key',
      type: 'key',
      name: 'public_key',
      value: string
    },
    {
      prim: 'option',
      type: 'option',
      name: 'name',
      value: string
    }
  ]
};

export type ServicesBigMapDto = Array<{
  data: {
    key: {
      prim: 'address',
      type: 'address',
      name: '@address_1',
      value: string
    },
    value: {
      prim: 'set',
      type: 'set',
      name: '@set_1',
      children: Array<{
        prim: 'address',
        type: 'address',
        name: '@address_2',
        value: string
      }>
    },
    key_hash: string,
    key_string: string,
    level: number,
    timestamp: string
  },
  count: number
}>;

export type OperationDto<TParameters = unknown> = {
  id: number,
  level: number,
  fee: number,
  counter: number,
  gas_limit: number,
  amount: number | undefined,
  content_index: number,
  consumed_gas: number,
  storage_size: number,
  parameters: TParameters,
  timestamp: string,
  protocol: string,
  hash: string,
  network: string,
  kind: string,
  source: string,
  destination: string,
  status: string,
  entrypoint: string,
  internal: boolean,
  mempool: boolean
};

export type SendPaymentOperationParametersDto = [
  {
    prim: 'pair',
    type: 'namedtuple',
    name: 'send_payment',
    children: [
      {
        prim: 'option',
        type: 'option',
        name: 'asset_value',
        value: string,
        children: [
          {
            name: 'token_address'
            prim: 'address'
            type: 'address'
            value: string
          },
          {
            name: 'token_id'
            prim: 'option'
            type: 'option'
            value: string
          },
          {
            name: 'value'
            prim: 'nat'
            type: 'nat'
            value: string
          }
        ] | undefined
      },
      {
        prim: 'nat',
        type: 'nat',
        name: 'operation_type',
        value: '1' | '2'
      },
      {
        prim: 'or',
        type: 'namedunion',
        name: 'payload',
        children: [
          {
            prim: 'bytes',
            type: 'bytes',
            name: 'public',
            value: string
          }
        ]
      }
    ]
  }
];

export type SendPaymentOperationDto = OperationDto<SendPaymentOperationParametersDto>;
