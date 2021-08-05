import { Button, Modal } from 'antd';
import React, { useCallback } from 'react';

import { Service } from '@tezospayments/common/dist/models/service';

import { setDeleted, setPaused } from '../../../../store/services/slice';
import { useAppDispatch, useCurrentLanguageResources } from '../../../hooks';

import './DangerZone.scss';

interface DangerZoneProps {
  service: Service;
}

export const DangerZone = (props: DangerZoneProps) => {
  const langResources = useCurrentLanguageResources();
  const dangerZoneLangResources = langResources.views.services.dangerZone;
  const dispatch = useAppDispatch();

  const handlePauseModalOkClick = useCallback(() => {
    dispatch(setPaused({ contractAddress: props.service.contractAddress, paused: !props.service.paused }));
  }, [dispatch, props.service]);

  const handleDeleteModalOkClick = useCallback(() => {
    dispatch(setDeleted({ contractAddress: props.service.contractAddress, deleted: !props.service.deleted }));
  }, [dispatch, props.service]);

  const confirm = useCallback((content: React.ReactNode, onOk: () => void) => {
    Modal.confirm({
      title: 'Confirm Operation',
      onOk,
      content,
      okText: 'Confirm',
      cancelText: 'Cancel',
      centered: true,
      transitionName: '',
      maskTransitionName: ''
    });
  }, []);

  const handlePauseClick = useCallback(() => {
    const text = props.service.paused ? dangerZoneLangResources.unPauseServiceConfirmation : dangerZoneLangResources.pauseServiceConfirmation;
    confirm(<p>{text}</p>, handlePauseModalOkClick);
  }, [confirm, dangerZoneLangResources.pauseServiceConfirmation, dangerZoneLangResources.unPauseServiceConfirmation, handlePauseModalOkClick, props.service.paused]);

  const handleDeleteClick = useCallback(() => {
    const text = props.service.deleted ? dangerZoneLangResources.unDeleteServiceConfirmation : dangerZoneLangResources.deleteServiceConfirmation;
    confirm(<p>{text}</p>, handleDeleteModalOkClick);
  }, [confirm, dangerZoneLangResources.deleteServiceConfirmation, dangerZoneLangResources.unDeleteServiceConfirmation, handleDeleteModalOkClick, props.service.deleted]);

  return <>
    <div className="service-danger-zone">
      <span className="service-danger-zone__header">{dangerZoneLangResources.title}</span>
      <div className="service-danger-zone__button-container">
        <p>{props.service.paused ? dangerZoneLangResources.unPauseServiceDescription : dangerZoneLangResources.pauseServiceDescription}</p>
        <Button className="service-button" type="default" onClick={handlePauseClick}>
          {props.service.paused ? dangerZoneLangResources.unPauseService : dangerZoneLangResources.pauseService}
        </Button>
      </div>
      <hr className="service-danger-zone__divider" />
      <div className="service-danger-zone__button-container">
        <p>{props.service.deleted ? dangerZoneLangResources.unDeleteServiceDescription : dangerZoneLangResources.deleteServiceDescription}</p>
        <Button className="service-button" type="primary" danger onClick={handleDeleteClick}>
          {props.service.deleted ? dangerZoneLangResources.unDeleteService : dangerZoneLangResources.deleteService}
        </Button>
      </div>
    </div>
  </>;
};

export const DangerZonePure = React.memo(DangerZone);
