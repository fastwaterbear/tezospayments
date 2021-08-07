import { Input, Radio, RadioChangeEvent, Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React, { useCallback, useState } from 'react';

import { PaymentType } from '@tezospayments/common/dist/models/payment';

import { getSortedServices } from '../../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../../hooks';
import { PaymentAmountPure } from '../PaymentAmount';

import './Settings.scss';

interface SettingsProps {
  address?: string;
}

export const Settings = (props: SettingsProps) => {
  const langResources = useCurrentLanguageResources();

  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const serviceLangResources = langResources.views.services;

  const services = useAppSelector(getSortedServices);
  const serviceOptions = services.map(s => ({
    label: s.name,
    value: s.contractAddress
  }));

  const [service, setService] = useState<string | undefined>(props.address);
  const handleServiceChanged = useCallback((value: SelectValue) => {
    setService(value as string);
  }, []);

  const typeOptions = [
    { label: 'Payment', value: PaymentType.Payment },
    { label: 'Donation', value: PaymentType.Donation },
  ];

  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.Payment);
  const handleTypeChanged = useCallback((e: RadioChangeEvent) => {
    setPaymentType(e.target.value);
  }, []);

  return <div className="accept-payments-settings">
    <span className="accept-payments-settings__caption">{serviceLangResources.service}</span>
    <Select
      className="accept-payments-settings__service-select"
      options={serviceOptions}
      value={service}
      onChange={handleServiceChanged}
    />

    <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.type}</span>
    <Radio.Group
      className="accept-payments-settings__type-select"
      optionType="button"
      buttonStyle="outline"
      options={typeOptions}
      value={paymentType}
      onChange={handleTypeChanged}
    />

    {paymentType === PaymentType.Payment
      ? <>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.amount}</span>
        <PaymentAmountPure onChange={e => { console.log(e); }} />
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.paymentPublicData}</span>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.orderId}</span>
        <Input className="accept-payments-settings__order-id-input" />
        <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.orderIdHelpText}</span>
      </>
      : <>
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.donationData}</span>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.shortDescription}</span>
        <Input.TextArea className="accept-payments-settings__order-id-input" showCount rows={5} maxLength={250} />
        <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.shortDescriptionHelpText}</span>
      </>}
  </div>;
};

export const SettingsPure = React.memo(Settings);
