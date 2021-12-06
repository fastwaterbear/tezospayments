declare namespace NodeJS {
  export interface ProcessEnv {
    TEZOSPAYMENTS_SERVICE_CONTRACT_ADDRESS: string;
    TEZOSPAYMENTS_API_KEY: string;
    TEZOSPAYMENTS_NETWORK_NAME: string | undefined;
  }
}
