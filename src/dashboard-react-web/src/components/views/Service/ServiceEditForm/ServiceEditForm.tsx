import { Button, Checkbox, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ServiceLinkHelper, Service, ServiceOperationType } from '@tezospayments/common';

import { config } from '../../../../config';
import { getCurrentAccount } from '../../../../store/accounts/selectors';
import { createService, updateService } from '../../../../store/services/slice';
import { ServiceLinksEditor } from '../../../common/ServiceLinks';
import { useAppDispatch, useAppSelector, useCurrentLanguageResources } from '../../../hooks';
import { View } from '../../View';
import { TokensEditor } from './TokensEditor';

import './ServiceEditForm.scss';

interface ServiceEditFormProps {
  service: Service;
  isCreateMode: boolean;
  readOnly: boolean;
}

const serviceLinkHelper = new ServiceLinkHelper();

export const ServiceEditForm = (props: ServiceEditFormProps) => {
  const history = useHistory();
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const servicesLangResources = langResources.views.services;
  const currentAccount = useAppSelector(getCurrentAccount);

  const dispatch = useAppDispatch();

  const handleCancelClick = useCallback(() => {
    history.push(`${config.routers.services}/${props.service.contractAddress}`);
  }, [history, props.service.contractAddress]);

  const [isFormValid, setIsFormValid] = useState(false);
  const [name, setName] = useState(props.service.name);
  const [description, setDescription] = useState(props.service.description);
  const [links, setLinks] = useState(props.service.links);
  const [allowedTokens, setAllowedTokens] = useState(props.service.allowedTokens);

  const validate = useCallback(() => {
    const isValid = !!name
      && links.every(l => !!serviceLinkHelper.getLinkInfo(l))
      && (allowedTokens.tez || allowedTokens.assets.length > 0);

    setIsFormValid(isValid);
  }, [allowedTokens.assets.length, allowedTokens.tez, links, name]);

  useEffect(() => validate(), [validate]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    validate();
  }, [validate]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    validate();
  }, [validate]);

  const handleLinksChange = useCallback((e: { value: string[] }) => {
    setLinks(e.value);
    validate();
  }, [validate]);

  const [acceptPayments, setAcceptPayments] = useState(props.service.allowedOperationType === ServiceOperationType.All || props.service.allowedOperationType === ServiceOperationType.Payment);
  const [acceptDonations, setAcceptDonations] = useState(props.service.allowedOperationType === ServiceOperationType.All || props.service.allowedOperationType === ServiceOperationType.Donation);

  const handleAllowedTokensChange = useCallback((allowedTokens: Service['allowedTokens']) => {
    setAllowedTokens(allowedTokens);
    validate();
  }, [validate]);

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
    const allowedOperationType = acceptPayments && acceptDonations
      ? ServiceOperationType.All
      : acceptPayments
        ? ServiceOperationType.Payment
        : ServiceOperationType.Donation;

    const updatedService: Service = {
      ...props.service,
      name,
      description,
      allowedOperationType,
      allowedTokens,
      links,
      network: props.isCreateMode && currentAccount ? currentAccount.network : props.service.network
    };

    if (props.isCreateMode) {
      dispatch(createService(updatedService));
    } else {
      dispatch(updateService(updatedService));
    }

    handleCancelClick();
  }, [acceptDonations, acceptPayments, allowedTokens, currentAccount, description, dispatch, handleCancelClick, links, name, props.isCreateMode, props.service]);

  const operationName = props.isCreateMode ? servicesLangResources.editing.createService : servicesLangResources.editing.updateService;

  return <>
    <View.Title>{operationName}</View.Title>
    <div className="service-edit">
      <span className="service-edit__caption">{servicesLangResources.editing.serviceName}</span>
      <Input readOnly={props.readOnly} placeholder={servicesLangResources.editing.serviceName} value={name} onChange={handleNameChange} />
      <span className="service-edit__caption">{servicesLangResources.editing.description}</span>
      <Input.TextArea readOnly={props.readOnly} rows={5} placeholder={servicesLangResources.editing.description} value={description} onChange={handleDescriptionChange} />
      <div className="service-edit__lists-container">
        <div className="service-edit__list-container">
          <span className="service-edit__list-header">{servicesLangResources.allowedCurrencies}</span>
          <TokensEditor allowedTokens={allowedTokens} onChange={handleAllowedTokensChange} />
        </div>
        <div className="service-edit__list-container">
          <span className="service-edit__list-header">{servicesLangResources.links}</span>
          <ServiceLinksEditor readOnly={props.readOnly} value={links as string[]} onChange={handleLinksChange} />
        </div>
      </div>
      <span className="service-edit__caption">{servicesLangResources.editing.accept}</span>
      <div className="service-edit__accept-list">
        <Checkbox disabled={props.readOnly} className="service-edit__accept-list-item" checked={acceptPayments} onChange={handleAcceptPaymentsChange}>
          {servicesLangResources.editing.acceptPayments}
        </Checkbox>
        <Checkbox disabled={props.readOnly} className="service-edit__accept-list-item" checked={acceptDonations} onChange={handleDonationsPaymentsChange}>
          {servicesLangResources.editing.acceptDonations}
        </Checkbox>
      </div>
      <div className="service-edit__buttons-container">
        <Button className="service-edit__button" onClick={handleCancelClick}>{commonLangResources.cancel}</Button>
        <Button className="service-edit__button" onClick={handleUpdateClick} disabled={!isFormValid || props.readOnly} type="primary">{operationName}</Button>
      </div>
    </div>
  </>;
};

export const ServiceEditFormPure = React.memo(ServiceEditForm);
