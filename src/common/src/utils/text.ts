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

const stringPad = (string: string, isStart: boolean, maxLength: number, fillString = ' ') => {
  if (String.prototype.padStart !== undefined)
    return string.padStart(maxLength, fillString);

  const stringLength = string.length;
  // eslint-disable-next-line eqeqeq
  if (maxLength <= stringLength || fillString == '')
    return string;

  const fillLength = maxLength - stringLength;
  let filler = fillString.repeat(Math.ceil(fillLength / fillString.length));

  if (filler.length > fillLength)
    filler = filler.slice(0, fillLength);

  return isStart ? filler + string : string + filler;
};

export const padStart = (string: string, maxLength: number, fillString = ' ') => String.prototype.padStart !== undefined
  ? string.padStart(maxLength, fillString)
  : stringPad(string, true, maxLength, fillString);

export const padEnd = (string: string, maxLength: number, fillString = ' ') => String.prototype.padEnd !== undefined
  ? string.padEnd(maxLength, fillString)
  : stringPad(string, false, maxLength, fillString);
