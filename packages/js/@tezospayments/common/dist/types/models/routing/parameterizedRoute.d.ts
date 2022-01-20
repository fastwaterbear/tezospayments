declare type ParameterizedRouteFactory = (...args: any[]) => string;
export declare type ParameterizedRoute<Factory extends ParameterizedRouteFactory> = Factory & {
    readonly template: string;
};
export declare const getParameterizedRoute: <Factory extends ParameterizedRouteFactory>(factory: Factory, template: string) => ParameterizedRoute<Factory>;
export {};
