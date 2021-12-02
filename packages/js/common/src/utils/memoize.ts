const defaultEqualityCheck = <T>(a: T, b: T) => a === b;

const areArgumentsShallowlyEqual = <T extends IArguments | null>(equalityCheck: (a: T, b: T) => boolean, prev: T, next: T) => {
    if (prev === null || next === null || prev.length !== next.length) {
        return false;
    }

    // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
    const length = prev.length;
    for (let i = 0; i < length; i++) {
        if (!equalityCheck(prev[i], next[i])) {
            return false;
        }
    }

    return true;
};

/* eslint-disable prefer-rest-params  */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const memoize = <TF extends (...args: any) => any>(func: TF, equalityCheck = defaultEqualityCheck): TF => {
    let lastArgs: IArguments | null = null;
    let lastResult: unknown = null;

    return (function () {
        if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
            // apply arguments instead of spreading for performance.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lastResult = func.apply(null, arguments as any);
        }

        lastArgs = arguments;
        return lastResult;
    } as TF);
};
/* eslint-enable prefer-spread */
/* eslint-enable prefer-rest-params */
/* eslint-enable @typescript-eslint/no-explicit-any */
