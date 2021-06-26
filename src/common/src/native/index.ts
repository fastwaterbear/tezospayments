/* eslint-disable @typescript-eslint/ban-ts-comment */
import { URL } from 'url';

if (!URL) {
  // @ts-ignore
  URL = window.URL;
}

export {
  URL
};
