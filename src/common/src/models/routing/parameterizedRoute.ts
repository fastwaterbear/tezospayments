// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParameterizedRouteFactory = (...args: any[]) => string;
export type ParameterizedRoute<Factory extends ParameterizedRouteFactory> = Factory & {
  readonly template: string;
};

export const getParameterizedRoute = <Factory extends ParameterizedRouteFactory>(
  factory: Factory, template: string
): ParameterizedRoute<Factory> => {
  (factory as Factory & { template: string }).template = template;

  return factory as ParameterizedRoute<Factory>;
};
