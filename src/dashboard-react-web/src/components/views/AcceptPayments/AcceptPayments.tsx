import { Skeleton } from 'antd';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Donation, Payment } from '@tezospayments/common/src/models/payment';

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

  const [paymentOrDonation, setPaymentOrDonation] = useState<Payment | Donation | undefined>();

  const handleSettingsPureChange = useCallback((data: Payment | Donation) => {
    setPaymentOrDonation(data);
  }, []);

  return <View title={acceptPaymentsLangResources.title}>
    <View.Title>{acceptPaymentsLangResources.title}</View.Title>
    {!servicesState.initialized
      ? <Skeleton active />
      : !servicesState.services.length
        ? <NoServicesCreatedPure />
        : <div className="accept-payments">
          <div className="accept-payments__settings">
            <AcceptPaymentsSettings address={address} onChange={handleSettingsPureChange} />
          </div>
          <div className="accept-payments__generator">
            <GeneratorPure paymentOrDonation={paymentOrDonation} />
          </div>
        </div>}
  </View >;
};

export const AcceptPaymentsPure = React.memo(AcceptPayments);
