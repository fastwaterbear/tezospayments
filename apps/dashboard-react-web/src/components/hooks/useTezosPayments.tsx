import { SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosPayments } from 'tezospayments';

import { Network } from '@tezospayments/common';

import { selectCurrentAccount } from '../../store/accounts/selectors';
import { useAppSelector } from './reduxHooks';
import { useAppContext } from './useAppContext';

const createTezosPayments = (serviceContractAddress: string, network: Network, tezosWallet: BeaconWallet) => {
  return new TezosPayments({
    serviceContractAddress,
    signing: {
      walletSigning: payload => tezosWallet.client
        .requestSignPayload({ signingType: SigningType.MICHELINE, payload })
        .then(r => r.signature)
    },
    defaultPaymentParameters: { network }
  });
};

const tezosPaymentsInstancesMap = new Map<string, TezosPayments>();

export const useTezosPayments = (serviceContractAddress: string | undefined | null) => {
  const appContext = useAppContext();
  const currentNetwork = useAppSelector(selectCurrentAccount)?.network;

  if (!serviceContractAddress || !currentNetwork)
    return null;

  let tezosPaymentsInstance = tezosPaymentsInstancesMap.get(serviceContractAddress);
  if (!tezosPaymentsInstance) {
    tezosPaymentsInstance = createTezosPayments(serviceContractAddress, currentNetwork, appContext.tezosWallet);
    tezosPaymentsInstancesMap.set(serviceContractAddress, tezosPaymentsInstance);
  }

  return tezosPaymentsInstance;
};
