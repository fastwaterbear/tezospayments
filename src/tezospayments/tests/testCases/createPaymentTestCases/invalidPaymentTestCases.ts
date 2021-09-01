import invalidAmountTestCases from './invalidAmountTestCases';
import invalidAssetTestCases from './invalidAssetTestCases';
import invalidCancelUrlTestCases from './invalidCancelUrlTestCases';
import invalidCreatedDateTestCases from './invalidCreatedDateTestCases';
import invalidTezosPaymentsOptionsTestCases from './invalidDefaultPaymentParametersTestCases';
import invalidExpiredDateTestCases from './invalidExpiredDateTestCases';
import invalidSuccessUrlTestCases from './invalidSuccessUrlTestCases';

export default invalidAmountTestCases
  .concat(invalidAssetTestCases)
  .concat(invalidCancelUrlTestCases)
  .concat(invalidSuccessUrlTestCases)
  .concat(invalidCreatedDateTestCases)
  .concat(invalidExpiredDateTestCases)
  .concat(invalidTezosPaymentsOptionsTestCases);
