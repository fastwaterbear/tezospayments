import { SigningType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { useMemo } from 'react';
import { TezosPayments } from 'tezospayments';

import { Network } from '@tezospayments/common';

import { getCurrentAccount } from '../../store/accounts/selectors';
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

export const useTezosPayments = (serviceContractAddress: string | undefined | null) => {
  const appContext = useAppContext();
  const currentNetwork = useAppSelector(getCurrentAccount)?.network;
  const tezosPaymentsInstancesMap = useMemo(
    () => serviceContractAddress && currentNetwork ? new Map<string, TezosPayments>() : null,
    [serviceContractAddress, currentNetwork]
  );

  if (!serviceContractAddress || !currentNetwork || !tezosPaymentsInstancesMap)
    return null;

  let tezosPaymentsInstance = tezosPaymentsInstancesMap.get(serviceContractAddress);
  if (!tezosPaymentsInstance) {
    tezosPaymentsInstance = createTezosPayments(serviceContractAddress, currentNetwork, appContext.tezosWallet);
    tezosPaymentsInstancesMap.set(serviceContractAddress, tezosPaymentsInstance);
  }

  return tezosPaymentsInstance;
};
