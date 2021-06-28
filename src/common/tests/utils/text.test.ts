import { getAvatarText } from '../../src/utils/text';

describe('Utils | Text', () => {
  const avatarTextTestCases: ReadonlyArray<readonly [text: string, expectedAvatarText: string, maxLength: number | undefined]> = [
    ['Fast Water Bear', 'FW', undefined],
    ['Fast Water Bear', 'FWB', 3],
    ['Fast Water Bear', 'FWB', 10],
    ['Fast Water Bear', 'F', 1],
    ['Fast Water Bear', '', 0],
    ['    Tezos    Payments  ', 'TP', undefined],
    ['Tezos', 'T', undefined],
    ['    Tezos    ', 'T', undefined],
    ['', '', undefined],
    ['         ', '', undefined],
    ['Fast Water Bear | Tezos Payments', 'FWB|TP', Infinity],
  ];

  test.each(avatarTextTestCases)('getting avatar text by text: %p -> %p [%d]', (text, expectedAvatarText, maxLength) => {
    const avatarText = getAvatarText(text, maxLength);

    expect(avatarText).toBe(expectedAvatarText);
  });
});
