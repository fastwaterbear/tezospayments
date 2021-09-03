import { Buffer } from 'buffer';

type ValidBase64Format = 'base64' | 'base64url';

// Node.js < 15
const isBase64UrlFormatSupported = Buffer.isEncoding('base64url');

export const decode = (base64String: string, format: ValidBase64Format = 'base64'): string => {
  if (format !== 'base64' && format !== 'base64url')
    return '';

  if (!isBase64UrlFormatSupported) {
    format = 'base64';
    base64String = base64UrlPreprocessor.prepareValueForDecoding(base64String);
  }

  return Buffer.from(base64String, format).toString('utf8');
};

export const encode = (value: string, format: ValidBase64Format = 'base64'): string => {
  if (format !== 'base64' && format !== 'base64url')
    return '';

  if (isBase64UrlFormatSupported)
    return Buffer.from(value, 'utf8').toString(format);

  const encodedValue = Buffer.from(value, 'utf8').toString('base64');
  return base64UrlPreprocessor.prepareEncodedValue(encodedValue);
};

const base64UrlPreprocessor = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  prepareEncodedValue: (base64value: string) => base64value
    .split('=')[0]!
    .replace(/\+/g, '-')
    .replace(/\//g, '_'),

  prepareValueForDecoding: (base64value: string) => {
    base64value = base64value
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    switch (base64value.length % 4) {
      case 0: return base64value;
      case 2: return base64value + '==';
      case 3: return base64value + '=';
      default:
        throw new Error('Invalid base64url value');
    }
  }
};
