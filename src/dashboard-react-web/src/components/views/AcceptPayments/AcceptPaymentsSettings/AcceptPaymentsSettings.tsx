import { Input, Radio, RadioChangeEvent, Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React from 'react';
import { useSelector } from 'react-redux';

import { PaymentType } from '@tezospayments/common';

import { getOperationsByService, getSortedServices } from '../../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../../hooks';
import { PaymentAmountPure } from '../PaymentAmount';

import './AcceptPaymentsSettings.scss';

interface AcceptPaymentsSettingsProps {
  serviceAddress: string | undefined;
  onServiceAddressChange: (value: SelectValue) => void;

  paymentType: PaymentType;
  onPaymentTypeChange: (e: RadioChangeEvent) => void;

  amount: string;
  onAmountChange: (rawValue: string) => void;

  asset: string | undefined;
  onAssetChange: (rawValue: string | undefined) => void;

  paymentId: string;
  onPaymentIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  donationDescription: string;
  onDonationDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const AcceptPaymentsSettings = (props: AcceptPaymentsSettingsProps) => {
  const langResources = useCurrentLanguageResources();
  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const serviceLangResources = langResources.views.services;
  const operationsByService = useSelector(getOperationsByService);

  const services = useAppSelector(getSortedServices);
  const serviceOptions = services.filter(s => !s.deleted).map(service => ({
    label: service.name,
    value: service.contractAddress,
    disabled: operationsByService.has(service.contractAddress)
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
        <PaymentAmountPure serviceAddress={props.serviceAddress} amount={props.amount} onAmountChange={props.onAmountChange}
          asset={props.asset} onAssetChange={props.onAssetChange} />
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.paymentData}</span>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.paymentId}</span>
        <Input className="accept-payments-settings__payment-id-input" value={props.paymentId} onChange={props.onPaymentIdChange} />
        <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.paymentIdHelpText}</span>
      </>
      : <>
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.donationData}</span>
        <span className="accept-payments-settings__description-caption">{acceptPaymentsLangResources.donationDescription}</span>
        <Input.TextArea className="accept-payments-settings__description-input" value={props.donationDescription} onChange={props.onDonationDescriptionChange}
          showCount rows={5} maxLength={250} />
        <span className="accept-payments-settings__help-text">{acceptPaymentsLangResources.donationDescriptionHelpText}</span>
      </>}
  </div>;
};

export const AcceptPaymentsSettingsPure = React.memo(AcceptPaymentsSettings);
