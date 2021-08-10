import { RadioChangeEvent, Skeleton } from 'antd';
import { SelectValue } from 'antd/lib/select';
import BigNumber from 'bignumber.js';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';

import { selectServicesState } from '../../../store/services/selectors';
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

  const { address } = useParams<{ address: string }>();
  const [service, setService] = useState<string | undefined>(address);
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.Payment);
  const [amount, setAmount] = useState<number>(1);
  const [publicData, setPublicData] = useState<string>('');
  const [donationData, setDonationData] = useState<string>('');

  const handleServiceChange = useCallback((value: SelectValue) => {
    setService(value as string);
  }, []);

  const handlePaymentTypeChange = useCallback((e: RadioChangeEvent) => {
    setPaymentType(e.target.value);
  }, []);

  const handleAmountChange = useCallback((rawValue: string) => {
    const numberValue = +rawValue;
    if (!isNaN(numberValue) && numberValue > 0) {
      setAmount(numberValue);
    }
  }, []);

  const handlePublicDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicData(e.target.value);
  }, []);

  const handleDonationDataChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDonationData(e.target.value);
  }, []);

  const emitOnChange = useCallback(() => {
    if (service) {
      const data = paymentType === PaymentType.Payment
        ? {
          created: new Date(),
          targetAddress: service,
          type: paymentType,
          amount: new BigNumber(amount),
          data: { public: { orderId: publicData } },
          urls: []
        } as Payment
        : {
          targetAddress: service,
          type: paymentType,
        } as Donation;
    }
  }, [amount, paymentType, publicData, service]);

  return <View title={acceptPaymentsLangResources.title}>
    <View.Title>{acceptPaymentsLangResources.title}</View.Title>
    {!servicesState.initialized
      ? <Skeleton active />
      : !servicesState.services.length
        ? <NoServicesCreatedPure />
        : <div className="accept-payments">
          <div className="accept-payments__settings">
            <AcceptPaymentsSettings
              serviceAddress={address} onServiceAddressChange={handleServiceChange}
              paymentType={paymentType} onPaymentTypeChange={handlePaymentTypeChange}
              amount={amount} onAmountChange={handleAmountChange}
              publicData={publicData} onPublicDataChange={handlePublicDataChange}
              donationData={donationData} onDonationDataChange={handleDonationDataChange}
            />
          </div>
          <div className="accept-payments__generator">
            <GeneratorPure />
          </div>
        </div>}
  </View >;
};

export const AcceptPaymentsPure = React.memo(AcceptPayments);
