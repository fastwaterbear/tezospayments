export declare type DeepPartial<T> = T extends Array<infer U1> ? Array<DeepPartial<U1>> : (T extends Map<infer K, infer U2> ? Map<K, DeepPartial<U2>> : (T extends Set<infer U3> ? Set<DeepPartial<U3>> : (T extends (...args: any) => any ? T : T extends new (...args: any) => any ? T : unknown extends T ? T : {
    [P in keyof T]?: DeepPartial<T[P]>;
})));
