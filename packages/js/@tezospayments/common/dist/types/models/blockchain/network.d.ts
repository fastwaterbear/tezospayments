declare const networksInternal: {
    readonly mainnet: {
        readonly id: "NetXdQprcVkpaWU";
        readonly name: "mainnet";
    };
    readonly hangzhounet: {
        readonly id: "NetXZSsxBpMQeAT";
        readonly name: "hangzhounet";
    };
};
interface NetworkInternal {
    readonly id: string;
    readonly name: string;
}
declare type Networks = {
    readonly [P in keyof typeof networksInternal]: (typeof networksInternal)[P] extends NetworkInternal & {
        readonly name: P;
    } ? (typeof networksInternal)[P] : never;
};
export declare type Network = Networks[keyof Networks];
export interface CustomNetwork {
    readonly id?: string;
    readonly name: string;
}
export declare const networks: Networks;
export declare const networksCollection: ({
    readonly id: "NetXdQprcVkpaWU";
    readonly name: "mainnet";
} | {
    readonly id: "NetXZSsxBpMQeAT";
    readonly name: "hangzhounet";
})[];
export declare const networkIdRegExp: RegExp;
export declare const networkNameRegExp: RegExp;
export {};
