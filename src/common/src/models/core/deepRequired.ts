export type DeepRequired<T> = T extends Array<infer U1> ? Array<DeepRequired<U1>> : (
  T extends Map<infer K, infer U2> ? Map<K, DeepRequired<U2>> : (
    T extends Set<infer U3> ? Set<DeepRequired<U3>> : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends (...args: any) => any
      ? T
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : T extends new (...args: any) => any
      ? T
      : unknown extends T
      ? T
      : {
        [P in keyof T]-?: DeepRequired<T[P]>
      }
    )
  )
);
