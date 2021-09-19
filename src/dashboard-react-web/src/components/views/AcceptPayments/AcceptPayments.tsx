import { RadioChangeEvent, Skeleton } from 'antd';
import { SelectValue } from 'antd/lib/select';
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
  const [amount, setAmount] = useState<string>('1');

  const getDefaultTicker = useCallback((serviceAddress: string | undefined) => {
    const service = servicesState.services.filter(s => s.contractAddress === serviceAddress)[0];

    return service
      ? service.allowedTokens.tez
        ? tezosMeta.symbol
        : service.allowedTokens.assets[0] && tokens.get(service.allowedTokens.assets[0])
          ? tokens.get(service.allowedTokens.assets[0])?.metadata?.symbol || null
          : null
      : null;
  }, [servicesState.services, tokens]);


  const [ticker, setTicker] = useState<string | null>(getDefaultTicker(serviceAddress));
  const [publicData, setPublicData] = useState<string>('');
  const [donationData, setDonationData] = useState<string>('');

  const handleServiceAddressChange = useCallback((value: SelectValue) => {
    const service = value as string;
    setServiceAddress(service);
    setTicker(getDefaultTicker(service));
  }, [getDefaultTicker]);

  const handlePaymentTypeChange = useCallback((e: RadioChangeEvent) => {
    setPaymentType(e.target.value);
  }, []);

  const handleAmountChange = useCallback((rawValue: string) => {
    setAmount(rawValue);
  }, []);

  const handleTickerChange = useCallback((rawValue: string) => {
    setTicker(rawValue);
  }, []);

  const handlePublicDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicData(e.target.value);
  }, []);

  const handleDonationDataChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDonationData(e.target.value);
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
              ticker={ticker} onTickerChange={handleTickerChange}
              publicData={publicData} onPublicDataChange={handlePublicDataChange}
              donationData={donationData} onDonationDataChange={handleDonationDataChange}
            />
          </div>
          <div className="accept-payments__generator">
            <GeneratorPure
              serviceAddress={serviceAddress}
              paymentType={paymentType}
              amount={amount}
              publicData={publicData}
              donationData={donationData}
            />
          </div>
        </div>}
  </View >;
};

export const AcceptPaymentsPure = React.memo(AcceptPayments);
