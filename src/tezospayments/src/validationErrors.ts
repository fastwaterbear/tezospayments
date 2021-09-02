export const tezosPaymentsOptionsValidationErrors = {
  // serviceContractAddress
  invalidServiceContractAddressType: 'Type of the serviceContractAddress option is invalid',
  serviceContractAddressHasInvalidLength: 'The serviceContractAddress option has an invalid address',
  serviceContractAddressIsNotContractAddress: 'The serviceContractAddress option isn\'t a contract address',
  // signing
  invalidSigningOption: 'The signing option is invalid',
  invalidApiSecretKeyType: 'The API secret key has an invalid type, it should be a string',
  emptyApiSecretKey: 'The API secret key is empty',
  invalidWalletSigningOptionType: 'The WalletSigning option has an invalid type, it should be a function',
  // defaultPaymentParameters
  invalidDefaultPaymentParameters: 'The default payment parameters are invalid',
  // defaultPaymentParameters.network
  emptyNetworkName: 'The network name is empty',
  invalidNetwork: 'The network is invalid',
  invalidNetworkName: 'The network name is invalid',
  invalidNetworkId: 'The network id is invalid',
  // defaultPaymentParameters.urlType
  invalidUrlType: 'The url type is invalid'
} as const;
