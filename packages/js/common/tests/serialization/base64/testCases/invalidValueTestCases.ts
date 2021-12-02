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

const invalidValueTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [value: Partial<TestType>, serializedValue: string]
]> = [
    [
      'invalid serialized value',
      [undefined as any, undefined as any]
    ],
    [
      'invalid serialized value',
      [null as any, null as any]
    ],
    [
      'invalid serialized value',
      [1111, { a: 1, b: 2, c: 3 } as any]
    ],
    [
      'invalid serialized value',
      [() => console.log('Test'), 'kkjgjgre4']
    ],
    [
      'empty serialized value',
      [{}, '']
    ],
    [
      'serialized object without some required fields: field1',
      [
        copyObjectExcludingFields(validTestObject, ['field1']),
        'eyJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSIsImZpZWxkNiI6MTcsImZpZWxkNyI6bnVsbH0'
      ]
    ],
    [
      'serialized object without some required fields: field3, field4',
      [

        copyObjectExcludingFields(validTestObject, ['field3', 'field4']),
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkNSI6ImZpZWxkNVZhbHVlIiwiZmllbGQ2IjoxNywiZmllbGQ3IjpudWxsfQ'
      ]
    ],
    [
      'serialized object without some required fields: field5',
      [

        copyObjectExcludingFields(validTestObject, ['field5']),
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDYiOjE3LCJmaWVsZDciOm51bGx9'
      ]
    ],
    [
      'serialized object with excess fields (a fields count is greater than the maximum)',
      [
        {
          ...validTestObject,
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`someExtraField${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSIsImZpZWxkNiI6MTcsImZpZWxkNyI6bnVsbCwic29tZUV4dHJhRmllbGQwIjowLCJzb21lRXh0cmFGaWVsZDEiOjEwMCwic29tZUV4dHJhRmllbGQyIjoyMDAsInNvbWVFeHRyYUZpZWxkMyI6MzAwLCJzb21lRXh0cmFGaWVsZDQiOjQwMCwic29tZUV4dHJhRmllbGQ1Ijo1MDAsInNvbWVFeHRyYUZpZWxkNiI6NjAwLCJzb21lRXh0cmFGaWVsZDciOjcwMCwic29tZUV4dHJhRmllbGQ4Ijo4MDAsInNvbWVFeHRyYUZpZWxkOSI6OTAwLCJzb21lRXh0cmFGaWVsZDEwIjoxMDAwLCJzb21lRXh0cmFGaWVsZDExIjoxMTAwLCJzb21lRXh0cmFGaWVsZDEyIjoxMjAwLCJzb21lRXh0cmFGaWVsZDEzIjoxMzAwLCJzb21lRXh0cmFGaWVsZDE0IjoxNDAwLCJzb21lRXh0cmFGaWVsZDE1IjoxNTAwLCJzb21lRXh0cmFGaWVsZDE2IjoxNjAwLCJzb21lRXh0cmFGaWVsZDE3IjoxNzAwLCJzb21lRXh0cmFGaWVsZDE4IjoxODAwLCJzb21lRXh0cmFGaWVsZDE5IjoxOTAwLCJzb21lRXh0cmFGaWVsZDIwIjoyMDAwLCJzb21lRXh0cmFGaWVsZDIxIjoyMTAwLCJzb21lRXh0cmFGaWVsZDIyIjoyMjAwLCJzb21lRXh0cmFGaWVsZDIzIjoyMzAwLCJzb21lRXh0cmFGaWVsZDI0IjoyNDAwLCJzb21lRXh0cmFGaWVsZDI1IjoyNTAwLCJzb21lRXh0cmFGaWVsZDI2IjoyNjAwLCJzb21lRXh0cmFGaWVsZDI3IjoyNzAwLCJzb21lRXh0cmFGaWVsZDI4IjoyODAwLCJzb21lRXh0cmFGaWVsZDI5IjoyOTAwfQ'
      ]
    ],
    [
      'serialized object with invalid field types: field2',
      [
        {
          ...validTestObject,
          field2: 132
        },
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOjEzMiwiZmllbGQzIjo4MCwiZmllbGQ0IjoxMDAsImZpZWxkNSI6ImZpZWxkNVZhbHVlIiwiZmllbGQ2IjoxNywiZmllbGQ3IjpudWxsfQ'
      ],
    ],
    [
      'serialized object with invalid field types: field5',
      [
        {
          ...validTestObject,
          field5: () => console.log(111),
        },
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDYiOjE3LCJmaWVsZDciOm51bGx9'
      ]
    ],
    [
      'serialized object with invalid field types: field8',
      [
        {
          ...validTestObject,
          field8: JSON.stringify({ x: '1.0', y: '1.23', z: '17.17' })
        },
        'eyJmaWVsZDEiOnsieCI6MTAwLCJ5IjoyMDB9LCJmaWVsZDIiOiJmaWVsZDJWYWx1ZSIsImZpZWxkMyI6ODAsImZpZWxkNCI6MTAwLCJmaWVsZDUiOiJmaWVsZDVWYWx1ZSIsImZpZWxkNiI6MTcsImZpZWxkNyI6bnVsbCwiZmllbGQ4Ijoie1wieFwiOlwiMS4wXCIsXCJ5XCI6XCIxLjIzXCIsXCJ6XCI6XCIxNy4xN1wifSJ9'
      ]
    ],
  ];

export default invalidValueTestCases;
