type ResourceParts = { [partNumber: number]: string };
type ValidateResourceParts<TParts> = TParts extends string
    ? never
    : TParts extends ResourceParts
    ? TParts
    : never;

export const joinResources = <TParts extends ResourceParts>(resources: ValidateResourceParts<TParts>) =>
    Object.getOwnPropertyNames(resources)
        .reduce((result, partNumber) => result += resources[+partNumber] || '', '');
