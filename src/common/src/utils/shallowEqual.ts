const is = (x: unknown, y: unknown) => {
    return (x === y)
        ? x !== 0 || y !== 0 || (1 / x) === (1 / y)
        : x !== x && y !== y;
};

export default function shallowEqual(objA: unknown, objB: unknown) {
    if (is(objA, objB))
        return true;

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null)
        return false;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length)
        return false;

    for (let i = 0; i < keysA.length; i++) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        /* eslint-disable @typescript-eslint/no-non-null-assertion */

        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]!)
            || !is((objA as any)[keysA[i]!], (objB as any)[keysA[i]!])
        )
            return false;

        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        /* eslint-enable @typescript-eslint/no-explicit-any */
    }

    return true;
}
