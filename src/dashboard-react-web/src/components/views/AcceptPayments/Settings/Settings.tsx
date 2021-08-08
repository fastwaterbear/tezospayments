import { Input, Radio, RadioChangeEvent, Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import BigNumber from 'bignumber.js';
import React, { useCallback, useState } from 'react';

import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';

import { getSortedServices } from '../../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../../hooks';
import { PaymentAmountPure } from '../PaymentAmount';

import './Settings.scss';

interface SettingsProps {
  address?: string;
  onChange: (payment: Payment | Donation) => void
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

  const typeOptions = [
    { label: 'Payment', value: PaymentType.Payment },
    { label: 'Donation', value: PaymentType.Donation },
  ];

  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.Payment);
  const [amount, setAmount] = useState(1);
  const [publicData, setPublicData] = useState('');

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

      props.onChange(data);
    }
  }, [amount, paymentType, props, publicData, service]);

  const handleTypeChange = useCallback((e: RadioChangeEvent) => {
    setPaymentType(e.target.value);
    emitOnChange();
  }, [emitOnChange]);

  const handleServiceChange = useCallback((value: SelectValue) => {
    setService(value as string);
    emitOnChange();
  }, [emitOnChange]);

  const handleAmountChange = useCallback((rawValue: string) => {
    const numberValue = +rawValue;
    if (!isNaN(numberValue) && numberValue > 0) {
      setAmount(numberValue);
      emitOnChange();
    }
  }, [emitOnChange]);

  const handlePublicDataChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPublicData(e.target.value);
    emitOnChange();
  }, [emitOnChange]);

  return <div className="accept-payments-settings">
    <span className="accept-payments-settings__caption">{serviceLangResources.service}</span>
    <Select
      className="accept-payments-settings__service-select"
      options={serviceOptions}
      value={service}
      onChange={handleServiceChange}
    />

    <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.type}</span>
    <Radio.Group
      className="accept-payments-settings__type-select"
      optionType="button"
      buttonStyle="outline"
      options={typeOptions}
      value={paymentType}
      onChange={handleTypeChange}
    />

    {paymentType === PaymentType.Payment
      ? <>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.amount}</span>
        <PaymentAmountPure onChange={handleAmountChange} value={amount} />
        <span className="accept-payments-settings__header">{acceptPaymentsLangResources.paymentPublicData}</span>
        <span className="accept-payments-settings__caption">{acceptPaymentsLangResources.orderId}</span>
        <Input className="accept-payments-settings__order-id-input" value={publicData} onChange={handlePublicDataChange} />
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
