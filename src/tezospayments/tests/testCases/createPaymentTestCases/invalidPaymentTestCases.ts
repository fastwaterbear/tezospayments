import invalidAmountTestCases from './invalidAmountTestCases';
import invalidAssetTestCases from './invalidAssetTestCases';
import invalidCancelUrlTestCases from './invalidCancelUrlTestCases';
import invalidSuccessUrlTestCases from './invalidSuccessUrlTestCases';

export default invalidAmountTestCases
  .concat(invalidAssetTestCases)
  .concat(invalidCancelUrlTestCases)
  .concat(invalidSuccessUrlTestCases);
