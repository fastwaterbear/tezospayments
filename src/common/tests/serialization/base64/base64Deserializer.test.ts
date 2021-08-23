import { Base64Deserializer } from '../../../src';
import { invalidValueTestCases, validValueTestCases } from './testCases';
import { TestType, testTypeFieldTypes } from './testType';

describe('Base64 deserializer', () => {
  let base64Deserializer: Base64Deserializer<TestType>;

  beforeEach(() => {
    base64Deserializer = new Base64Deserializer(testTypeFieldTypes);
  });

  test.each(validValueTestCases)('deserialize the valid serialized value: %p', (_, [expectedValue, serializedValue]) => {
    expect(base64Deserializer.deserialize(serializedValue)).toEqual(expectedValue);
  });

  test.each(invalidValueTestCases)('deserialize the invalid serialized value: %p', (_, [, invalidSerializedValue]) => {
    expect(base64Deserializer.deserialize(invalidSerializedValue)).toBeNull();
  });
});
