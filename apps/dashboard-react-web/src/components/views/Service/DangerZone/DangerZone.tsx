import { Button, Modal } from 'antd';
import React, { useCallback } from 'react';

import { Service } from '@tezospayments/common';

import { setDeleted, setPaused } from '../../../../store/services/slice';
import { useAppDispatch, useCurrentLanguageResources } from '../../../hooks';

import './DangerZone.scss';

interface DangerZoneProps {
  service: Service;
  readOnly: boolean;
}

export const DangerZone = (props: DangerZoneProps) => {
  const langResources = useCurrentLanguageResources();
  const dangerZoneLangResources = langResources.views.services.dangerZone;
  const dispatch = useAppDispatch();

  const handlePauseModalOkClick = useCallback(() => {
    dispatch(setPaused({ service: props.service, paused: !props.service.paused }));
  }, [dispatch, props.service]);

  const handleDeleteModalOkClick = useCallback(() => {
    dispatch(setDeleted({ service: props.service, deleted: !props.service.deleted }));
  }, [dispatch, props.service]);

  const confirm = useCallback((text: string, isDanger: boolean, onOk: () => void) => {
    Modal.confirm({
      title: 'Confirm Operation',
      onOk,
      content: <p>{text}</p>,
      okText: 'Yes',
      okType: isDanger ? 'danger' : 'primary',
      cancelText: 'No',
      centered: true,
      transitionName: '',
      maskTransitionName: ''
    });
  }, []);

  const handlePauseClick = useCallback(() => {
    const text = props.service.paused ? dangerZoneLangResources.unPauseServiceConfirmation : dangerZoneLangResources.pauseServiceConfirmation;
    confirm(text, false, handlePauseModalOkClick);
  }, [confirm, dangerZoneLangResources.pauseServiceConfirmation, dangerZoneLangResources.unPauseServiceConfirmation, handlePauseModalOkClick, props.service.paused]);

  const handleDeleteClick = useCallback(() => {
    const text = props.service.deleted ? dangerZoneLangResources.unDeleteServiceConfirmation : dangerZoneLangResources.deleteServiceConfirmation;
    confirm(text, !props.service.deleted, handleDeleteModalOkClick);
  }, [confirm, dangerZoneLangResources.deleteServiceConfirmation, dangerZoneLangResources.unDeleteServiceConfirmation, handleDeleteModalOkClick, props.service.deleted]);

  return <>
    <div className="service-danger-zone">
      <span className="service-danger-zone__header">{dangerZoneLangResources.title}</span>
      <div className="service-danger-zone__button-container">
        <p>{props.service.paused ? dangerZoneLangResources.unPauseServiceDescription : dangerZoneLangResources.pauseServiceDescription}</p>
        <Button disabled={props.readOnly} className="service-button" type="default" onClick={handlePauseClick}>
          {props.service.paused ? dangerZoneLangResources.unPauseService : dangerZoneLangResources.pauseService}
        </Button>
      </div>
      <hr className="service-danger-zone__divider" />
      <div className="service-danger-zone__button-container">
        <p>{props.service.deleted ? dangerZoneLangResources.unDeleteServiceDescription : dangerZoneLangResources.deleteServiceDescription}</p>
        <Button disabled={props.readOnly} className="service-button" type="primary" danger onClick={handleDeleteClick}>
          {props.service.deleted ? dangerZoneLangResources.unDeleteService : dangerZoneLangResources.deleteService}
        </Button>
      </div>
    </div>
  </>;
};

export const DangerZonePure = React.memo(DangerZone);
