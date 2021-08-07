import { Input, Radio, Select } from 'antd';
import React from 'react';

import { PaymentType } from '@tezospayments/common/dist/models/payment';

import { useCurrentLanguageResources } from '../../../hooks';
import { PaymentAmountPure } from '../PaymentAmount';

import './Settings.scss';

interface SettingsProps {
  address?: string;
}

export const Settings = (props: SettingsProps) => {
  const langResources = useCurrentLanguageResources();

  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const serviceLangResources = langResources.views.services;

  const typeOptions = [
    { label: 'Payment', value: PaymentType.Payment },
    { label: 'Donation', value: PaymentType.Donation },
  ];

  return <div className="accept-payments-settings">
    <span className="accept-payments-settings__caption">{serviceLangResources.service}</span>
    <Select className="accept-payments-settings__service-select" />

    <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.type}</span>
    <Radio.Group className="accept-payments-settings__type-select" optionType="button" buttonStyle="outline" options={typeOptions} defaultValue={typeOptions[0]?.value} />

    <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.amount}</span>
    <PaymentAmountPure onChange={() => { console.log('a'); }} />

    <span className="accept-payments-settings__header">{acceptPaymentsLangResources.paymentPublicData}</span>
    <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.orderId}</span>
    <Input className="accept-payments-settings__order-id-input" />
    <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.orderIdHelpText}</span>
  </div>;
};

export const SettingsPure = React.memo(Settings);
