export declare enum IconId {
    Common = 0,
    Email = 1,
    Telegram = 2,
    Facebook = 3,
    Twitter = 4,
    Instagram = 5,
    GitHub = 6,
    Reddit = 7
}
interface LinkInfo {
    readonly rawLink: string;
    readonly formattedLink: string;
    readonly displayLink: string;
    readonly icon: IconId;
}
declare type LinkInfoProvider = (link: string) => LinkInfo | false;
export declare class ServiceLinkHelper {
    static readonly linkInfoProviders: readonly LinkInfoProvider[];
    getLinkInfo(link: string, isEditMode?: boolean): LinkInfo | null;
    linkInfoIsValid(linkInfo: LinkInfo): boolean;
}
export {};
