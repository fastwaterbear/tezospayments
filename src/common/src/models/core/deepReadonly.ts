export type DeepReadonly<T> = (
  T extends ReadonlyMap<infer K, infer U3> ? ReadonlyMap<K, DeepReadonly<U3>> : (
    T extends ReadonlySet<infer U4> ? ReadonlySet<DeepReadonly<U4>> : (
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
