export interface ServiceDto {
  allowed_operation_type: string;
  allowed_tokens: {
    tez: boolean,
    assets: string[]
  };
  deleted: boolean;
  metadata: string;
  owner: string;
  paused: boolean
  version: string;
}
