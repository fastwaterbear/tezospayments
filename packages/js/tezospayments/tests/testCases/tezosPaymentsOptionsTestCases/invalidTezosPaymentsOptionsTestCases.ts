import invalidDefaultPaymentParametersTestCases from './invalidDefaultPaymentParameters';
import invalidNetworkTestCases from './invalidNetworkTestCases';
import invalidServiceContractAddressTestCases from './invalidServiceContractAddressTestCases';
import invalidSigningTestCases from './invalidSigningTestCases';

export default invalidServiceContractAddressTestCases
  .concat(invalidNetworkTestCases)
  .concat(invalidSigningTestCases)
  .concat(invalidDefaultPaymentParametersTestCases);
