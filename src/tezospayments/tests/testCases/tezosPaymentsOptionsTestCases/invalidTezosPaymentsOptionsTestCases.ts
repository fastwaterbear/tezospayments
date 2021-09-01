import invalidDefaultPaymentParametersTestCases from './invalidDefaultPaymentParameters';
import invalidServiceContractAddressTestCases from './invalidServiceContractAddressTestCases';
import invalidSigningTestCases from './invalidSigningTestCases';

export default invalidServiceContractAddressTestCases
  .concat(invalidSigningTestCases)
  .concat(invalidDefaultPaymentParametersTestCases);
