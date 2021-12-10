import { Base64Serializer } from '../../../src';
import { invalidValueTestCases, validValueTestCases } from './testCases';
import { TestType, testTypeFieldTypes } from './testType';

describe('Base64 serializer', () => {
  let base64Serializer: Base64Serializer<TestType>;

  beforeEach(() => {
    base64Serializer = new Base64Serializer(testTypeFieldTypes);
  });

  test.each(validValueTestCases)('serialize the valid value: %p', (_, [value, expectedSerializedValue]) => {
    expect(base64Serializer.serialize(value)).toEqual(expectedSerializedValue);
  });

  test.each(invalidValueTestCases)('serialize the invalid value: %p', (_, [invalidValue]) => {
    expect(base64Serializer.serialize(invalidValue as TestType)).toBeNull();
  });
});
