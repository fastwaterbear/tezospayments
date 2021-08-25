import { default as invalidDefaultPaymentParameters } from './invalidDefaultPaymentParameters';
import { default as invalidServiceContractAddressTestCases } from './invalidServiceContractAddressTestCases';
import { default as invalidSigningTestCases } from './invalidSigningTestCases';

export default invalidServiceContractAddressTestCases
  .concat(invalidSigningTestCases)
  .concat(invalidDefaultPaymentParameters);
