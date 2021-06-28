export const capitalize = (value: string): string => value && (value[0]?.toLocaleUpperCase() + value.slice(1));

export const getAvatarText = (value: string, maxLength = 2) => {
  if (!value || !maxLength)
    return '';

  let result = '';

  for (let i = 0, j = 0, isWord = false; i < value.length; i++) {
    if (!isWord && value[i] !== ' ') {
      isWord = true;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result += value[i]!;

      if (++j === maxLength)
        return result;
    }
    else if (isWord && value[i] === ' ') {
      isWord = false;
    }
  }

  return result;
};
