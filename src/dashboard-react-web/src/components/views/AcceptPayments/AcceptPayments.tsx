import { RadioChangeEvent, Skeleton } from 'antd';
import { SelectValue } from 'antd/lib/select';
import BigNumber from 'bignumber.js';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PaymentType, tezosMeta } from '@tezospayments/common';

import { selectServicesState, selectTokensState } from '../../../store/services/selectors';
import { NoServicesCreatedPure } from '../../common/NoServicesCreated';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { AcceptPaymentsSettings } from './AcceptPaymentsSettings';
import { GeneratorPure } from './Generator';

import './AcceptPayments.scss';

export const AcceptPayments = () => {
  const langResources = useCurrentLanguageResources();
  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const servicesState = useAppSelector(selectServicesState);
  const tokens = useAppSelector(selectTokensState);

  const { address: addressFromUrl } = useParams<{ address: string }>();
  const [serviceAddress, setServiceAddress] = useState<string | undefined>(addressFromUrl);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.Payment);
  const [amount, setAmount] = useState<string>('');

  const getDefaultAsset = useCallback((serviceAddress: string | undefined) => {
    const service = servicesState.services.filter(s => s.contractAddress === serviceAddress)[0];

    return service
      ? service.allowedTokens.tez ? undefined : service.allowedTokens.assets[0]
      : undefined;
  }, [servicesState.services]);

  const [asset, setAsset] = useState<string | undefined>(getDefaultAsset(serviceAddress));
  const [paymentId, setPaymentId] = useState<string>('');
  const [clientData, setClientData] = useState<Record<string, string>>();

  const decimals = asset ? tokens.get(asset)?.metadata?.decimals || 0 : tezosMeta.decimals;

  const handleServiceAddressChange = useCallback((value: SelectValue) => {
    const service = value as string;
    setServiceAddress(service);
    setAsset(getDefaultAsset(service));
  }, [getDefaultAsset]);

  const handlePaymentTypeChange = useCallback((e: RadioChangeEvent) => {
    setPaymentType(e.target.value);
  }, []);

  const handleAmountChange = useCallback((rawValue: string) => {
    const formattedValue = rawValue ? new BigNumber(rawValue).toFormat(decimals, { groupSeparator: '', decimalSeparator: '.' }) : '';
    setAmount(formattedValue);
  }, [decimals]);

  const handleAssetChange = useCallback((rawValue: string | undefined) => {
    setAsset(rawValue || undefined);
    setAmount('');
  }, []);

  const handlePaymentIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentId(e.target.value);
  }, []);

  const handleDonationDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClientData({ description: e.target.value });
  }, []);

  return <View title={acceptPaymentsLangResources.title}>
    <View.Title>{acceptPaymentsLangResources.title}</View.Title>
    {!servicesState.initialized
      ? <Skeleton active />
      : !servicesState.services.length
        ? <NoServicesCreatedPure />
        : <div className="accept-payments">
          <div className="accept-payments__settings">
            <AcceptPaymentsSettings
              serviceAddress={serviceAddress} onServiceAddressChange={handleServiceAddressChange}
              paymentType={paymentType} onPaymentTypeChange={handlePaymentTypeChange}
              amount={amount} onAmountChange={handleAmountChange}
              asset={asset} onAssetChange={handleAssetChange}
              paymentId={paymentId} onPaymentIdChange={handlePaymentIdChange}
              donationDescription={clientData?.description || ''} onDonationDescriptionChange={handleDonationDescriptionChange}
            />
          </div>
          <div className="accept-payments__generator">
            <GeneratorPure
              serviceAddress={serviceAddress}
              paymentType={paymentType}
              assetAddress={asset}
              amount={amount}
              paymentId={paymentId}
              clientData={clientData}
            />
          </div>
        </div>}
  </View >;
};

export const AcceptPaymentsPure = React.memo(AcceptPayments);
