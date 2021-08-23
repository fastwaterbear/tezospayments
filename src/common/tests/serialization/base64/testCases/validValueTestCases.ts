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

const validValueTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [value: TestType, serializedValue: string]
]> = [
    [
      'simple serialized object',
      [
        validTestObject,
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSIsImZpZWxkNiI6MTcsImZpZWxkNyI6bnVsbH0=',
      ]
    ],
    [
      'simple serialized object (the field4 is string)',
      [
        {
          ...validTestObject,
          field4: 'field4Value'
        },
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6ImZpZWxkNFZhbHVlIiwiZmllbGQ1IjoiZmllbGQ1VmFsdWUiLCJmaWVsZDYiOjE3LCJmaWVsZDciOm51bGx9',
      ]
    ],
    [
      'null values as optional',
      [
        copyObjectExcludingFields(validTestObject, ['field6', 'field7', 'field8']) as TestType,
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSJ9'
      ]
    ],

  ];

export default validValueTestCases;
