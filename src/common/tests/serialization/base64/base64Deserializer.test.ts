import { Base64Deserializer } from '../../../src';
import negativeTestCases from './testCases/base64DeserializerNegativeTestCases';
import positiveTestCases from './testCases/base64DeserializerPositiveTestCases';
import { TestType, testTypeFieldTypes } from './testType';

describe('Base64 deserializer', () => {
  let base64Deserializer: Base64Deserializer<TestType>;

  beforeEach(() => {
    base64Deserializer = new Base64Deserializer(testTypeFieldTypes);
  });

  test.each(positiveTestCases)('deserialize the valid serialized value: %p', (_, serializedValue, expectedValue) => {
    expect(base64Deserializer.deserialize(serializedValue)).toEqual(expectedValue);
  });

  test.each(negativeTestCases)('deserialize the invalid serialized value: %p', (_, [_obj, invalidSerializedValue]) => {
    expect(base64Deserializer.deserialize(invalidSerializedValue)).toBeNull();
  });
});
