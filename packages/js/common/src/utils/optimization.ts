import BigNumber from 'bignumber.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
const emptyArray: any[] = [];
const emptyObject = {};
const emptyMap = new Map();
const emptySet: Set<any> = new Set();
const zeroBigNumber = new BigNumber(0);

export default {
    emptyArray,
    emptyMap,
    emptySet,
    emptyObject,
    zeroBigNumber
};
