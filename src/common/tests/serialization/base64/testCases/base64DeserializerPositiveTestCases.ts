/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { copyObjectExcludingFields } from '../../../testHelpers';
import { TestType } from '../testType';

const validTestObject: TestType = {
  field1: { x: 100, y: 200 },
  field2: 'field2Value',
  field3: 80,
  field4: 100,
  field5: 'field5Value',
  field6: 17,
  field7: null,
};

const positiveTestCases: ReadonlyArray<readonly [
  message: string | null,
  serializedValue: string,
  expectedTestValue: TestType
]> = [
    [
      'simple serialized object',
      'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSIsImZpZWxkNiI6MTcsImZpZWxkNyI6bnVsbH0=',
      validTestObject
    ],
    [
      'simple serialized object (the field4 is string)',
      'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6ImZpZWxkNFZhbHVlIiwiZmllbGQ1IjoiZmllbGQ1VmFsdWUiLCJmaWVsZDYiOjE3LCJmaWVsZDciOm51bGx9',
      {
        ...validTestObject,
        field4: 'field4Value'
      }
    ],
    [
      'null values as optional',
      'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSJ9',
      copyObjectExcludingFields(validTestObject, ['field6', 'field7', 'field8']) as TestType
    ],

  ];

export default positiveTestCases;
