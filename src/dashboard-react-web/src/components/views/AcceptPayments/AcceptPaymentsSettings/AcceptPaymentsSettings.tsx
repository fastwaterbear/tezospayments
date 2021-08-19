import { Input, Radio, RadioChangeEvent, Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React from 'react';

import { PaymentType } from '@tezospayments/common';

import { getSortedServices } from '../../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../../hooks';
import { PaymentAmountPure } from '../PaymentAmount';

import './AcceptPaymentsSettings.scss';

interface AcceptPaymentsSettingsProps {
  serviceAddress: string | undefined;
  onServiceAddressChange: (value: SelectValue) => void;

  paymentType: PaymentType;
  onPaymentTypeChange: (e: RadioChangeEvent) => void;

  amount: number;
  onAmountChange: (rawValue: string) => void;

  publicData: string;
  onPublicDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  donationData: string;
  onDonationDataChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AcceptPaymentsSettings = (props: AcceptPaymentsSettingsProps) => {
  const langResources = useCurrentLanguageResources();
  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const serviceLangResources = langResources.views.services;

  const services = useAppSelector(getSortedServices);
  const serviceOptions = services.map(s => ({
    label: s.name,
    value: s.contractAddress
  }));

  const typeOptions = [
    { label: 'Payment', value: PaymentType.Payment },
    { label: 'Donation', value: PaymentType.Donation },
  ];

  return <div className="accept-payments-settings">
    <span className="accept-payments-settings__caption">{serviceLangResources.service}</span>
    <Select
      className="accept-payments-settings__service-select"
      options={serviceOptions}
      value={props.serviceAddress}
      onChange={props.onServiceAddressChange}
    />

    <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.type}</span>
    <Radio.Group
      className="accept-payments-settings__type-select"
      optionType="button"
      buttonStyle="outline"
      options={typeOptions}
      value={props.paymentType}
      onChange={props.onPaymentTypeChange}
    />

    {props.paymentType === PaymentType.Payment
      ? <>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.amount}</span>
        <PaymentAmountPure onChange={props.onAmountChange} value={props.amount} />
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.paymentPublicData}</span>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.orderId}</span>
        <Input className="accept-payments-settings__order-id-input" value={props.publicData} onChange={props.onPublicDataChange} />
        <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.orderIdHelpText}</span>
      </>
      : <>
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.donationData}</span>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.shortDescription}</span>
        <Input.TextArea className="accept-payments-settings__order-id-input" value={props.donationData} onChange={props.onDonationDataChange}
          showCount rows={5} maxLength={250} />
        <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.shortDescriptionHelpText}</span>
      </>}
  </div>;
};

export const AcceptPaymentsSettingsPure = React.memo(AcceptPaymentsSettings);
