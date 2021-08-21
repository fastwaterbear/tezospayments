export declare const memoize: <TF extends (...args: any) => any>(func: TF, equalityCheck?: <T>(a: T, b: T) => boolean) => TF;
