import { config } from '../../../config';

export const connect = {
  actions: {
    connect: {
      title: 'Connect',
      connectToMainnet: 'Connect to Tezos Mainnet',
      connectToGranada: 'Connect to Granada Testnet',
      connectToFlorence: 'Connect to Florence Testnet',
      connectToEdo2: 'Connect to Edo2 Testnet',
      description: `In order to use the ${config.app.title} service you have to connect a Tezos account`
    }
  }
};
