export type DeepReadonly<T> = T extends ReadonlyArray<infer U1> ? ReadonlyArray<DeepReadonly<U1>> : (
  T extends ReadonlyMap<infer K, infer U2> ? ReadonlyMap<K, DeepReadonly<U2>> : (
    T extends ReadonlySet<infer U3> ? ReadonlySet<DeepReadonly<U3>> : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends (...args: any) => any
      ? T
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : T extends new (...args: any) => any
      ? T
      : unknown extends T
      ? T
      : {
        readonly [P in keyof T]: DeepReadonly<T[P]>
      }
    )
  )
);
