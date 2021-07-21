import { PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Service, ServiceOperationType } from '@tezospayments/common/dist/models/service';

import { config } from '../../../../config';
import { ServiceLinksEditor } from '../../../common/ServiceLinks';
import { useCurrentLanguageResources } from '../../../hooks';
import { TokensPure } from '../Tokens';

import './UpdateService.scss';

interface UpdateServiceProps {
  service: Service;
}

export const UpdateService = (props: UpdateServiceProps) => {
  const history = useHistory();
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const servicesLangResources = langResources.views.services;

  const handleCancelClick = useCallback(() => {
    history.push(`${config.routers.services}/${props.service.contractAddress}`);
  }, [history, props.service.contractAddress]);

  const [name, setName] = useState(props.service.name);
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);

  const [description, setDescription] = useState(props.service.description);
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), []);

  const [acceptPayments, setAcceptPayments] = useState(props.service.allowedOperationType === ServiceOperationType.All || props.service.allowedOperationType === ServiceOperationType.Payment);
  const [acceptDonations, setAcceptDonations] = useState(props.service.allowedOperationType === ServiceOperationType.All || props.service.allowedOperationType === ServiceOperationType.Donation);

  const handleAcceptPaymentsChange = useCallback((e: CheckboxChangeEvent) => {
    setAcceptPayments(e.target.checked);
    if (!e.target.checked && !acceptDonations) {
      setAcceptDonations(true);
    }
  }, [acceptDonations]);

  const handleDonationsPaymentsChange = useCallback((e: CheckboxChangeEvent) => {
    setAcceptDonations(e.target.checked);
    if (!e.target.checked && !acceptPayments) {
      setAcceptPayments(true);
    }
  }, [acceptPayments]);

  const handleUpdateClick = useCallback(() => {
    const allowedOperationsType = acceptPayments && acceptDonations
      ? ServiceOperationType.All
      : acceptPayments
        ? ServiceOperationType.Payment
        : ServiceOperationType.Donation;

    const message = JSON.stringify({
      name, description, allowedOperationsType: ServiceOperationType[allowedOperationsType]
    });

    alert(message);
  }, [acceptDonations, acceptPayments, description, name]);

  return <div className="service-edit">
    <span className="service-edit__caption">{servicesLangResources.editing.serviceName}</span>
    <Input placeholder={servicesLangResources.editing.serviceName} value={name} onChange={handleNameChange} />
    <span className="service-edit__caption">{servicesLangResources.editing.description}</span>
    <Input.TextArea rows={5} placeholder={servicesLangResources.editing.description} value={description} onChange={handleDescriptionChange} />
    <div className="service-edit__lists-container">
      <div className="service-edit__list-container">
        <span className="service-edit__list-header">{servicesLangResources.allowedCurrencies}</span>
        <TokensPure service={props.service} />
        <Button className="service-edit__button" disabled icon={<PlusOutlined />}>
          {`${servicesLangResources.editing.addCurrency} (${commonLangResources.comingSoon})`}
        </Button>
      </div>
      <div className="service-edit__list-container">
        <span className="service-edit__list-header">{servicesLangResources.links}</span>
        <ServiceLinksEditor defaultValue={props.service.links as string[]} />
      </div>
    </div>
    <span className="service-edit__caption">{servicesLangResources.editing.accept}</span>
    <div className="service-edit__accept-list">
      <Checkbox className="service-edit__accept-list-item" checked={acceptPayments} onChange={handleAcceptPaymentsChange}>
        {servicesLangResources.editing.acceptPayments}
      </Checkbox>
      <Checkbox className="service-edit__accept-list-item" checked={acceptDonations} onChange={handleDonationsPaymentsChange}>
        {servicesLangResources.editing.acceptDonations}
      </Checkbox>
    </div>
    <div className="service-edit__buttons-container">
      <Button className="service-edit__button" onClick={handleCancelClick}>{commonLangResources.cancel}</Button>
      <Button className="service-edit__button" onClick={handleUpdateClick} type="primary">{servicesLangResources.editing.updateService}</Button>
    </div>
  </div>;
};

export const UpdateServicePure = React.memo(UpdateService);
