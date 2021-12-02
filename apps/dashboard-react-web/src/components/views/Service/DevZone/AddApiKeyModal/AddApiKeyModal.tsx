import { CopyOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Radio, RadioChangeEvent, Typography, Popconfirm, Spin } from 'antd';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { EncodedKeyPair, KeyType, Service } from '@tezospayments/common';

import { addApiKey } from '../../../../../store/services/slice';
import { useCurrentLanguageResources, useKeyPairGenerator } from '../../../../hooks';

import './AddApiKeyModal.scss';

const Search = Input.Search;

interface AddApiKeyModalProps {
  service: Service;
  visible: boolean;
  onCancel: () => void;
}

const algorithmOptions = Object.values(KeyType).map(v => ({ label: v, value: v }));

export const AddApiKeyModal = (props: AddApiKeyModalProps) => {
  const generateKeyPair = useKeyPairGenerator();
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const servicesLangResources = langResources.views.services;
  const [keyPair, setKeyPair] = useState<EncodedKeyPair>();
  const publicKeyRef = useRef<Input>(null);
  const secretKeyRef = useRef<Input>(null);
  const dispatch = useDispatch();

  const [algorithmType, setAlgorithmType] = useState(algorithmOptions[0]?.value || KeyType.Ed25519);
  const handleAlgorithmTypeChanges = useCallback((e: RadioChangeEvent) => {
    setAlgorithmType(e.target.value);
  }, []);

  const [name, setName] = useState('');
  const handleNameChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  useEffect(() => {
    generateKeyPair && setKeyPair(generateKeyPair(algorithmType));
  }, [algorithmType, generateKeyPair]);

  const handleCopyClick = useCallback((ref: React.RefObject<Input>) => {
    const input = ref.current;

    if (input) {
      input.select();
      navigator.clipboard.writeText(input.state.value);
    }
  }, []);

  const handleGenerateKeysButton = useCallback(() => {
    generateKeyPair && setKeyPair(generateKeyPair(algorithmType));
  }, [algorithmType, generateKeyPair]);

  const handleAddKeyConfirm = useCallback(() => {
    if (keyPair?.publicKey)
      dispatch(addApiKey({ service: props.service, signingKey: { name, publicKey: keyPair.publicKey } }));

    props.onCancel();
  }, [dispatch, name, props, keyPair]);

  const editorsDisabled = !keyPair;
  const modalBody = <>
    <span className="api-key-modal__label">{servicesLangResources.devZone.name}:</span>
    <Input disabled={editorsDisabled} autoFocus value={name} onChange={handleNameChanged} />
    <span className="api-key-modal__label">{servicesLangResources.devZone.algorithm}:</span>
    <div className="api-key-modal__algorithm-container">
      <Radio.Group disabled={editorsDisabled} options={algorithmOptions} value={algorithmType} onChange={handleAlgorithmTypeChanges} />
      <Button disabled={editorsDisabled} onClick={handleGenerateKeysButton}>{servicesLangResources.devZone.generateKeys}</Button>
    </div>
    <Divider />
    <span className="api-key-modal__label">{servicesLangResources.devZone.publicKey}:</span>
    <Search ref={publicKeyRef} disabled={editorsDisabled} readOnly value={keyPair?.publicKey} enterButton={<Button icon={<CopyOutlined />} />} onSearch={() => handleCopyClick(publicKeyRef)} />
    <span className="api-key-modal__label">{servicesLangResources.devZone.secretKey}:</span>
    <Search ref={secretKeyRef} disabled={editorsDisabled} readOnly value={keyPair?.privateKey} enterButton={<Button icon={<CopyOutlined />} />} onSearch={() => handleCopyClick(secretKeyRef)} />
    <Typography.Text mark>{servicesLangResources.devZone.saveSecretKeyWarning}</Typography.Text>
  </>;

  return <Modal className="api-key-modal" title={servicesLangResources.devZone.addKey}
    centered destroyOnClose visible={props.visible} onCancel={props.onCancel}
    footer={<div className="api-key-modal__footer">
      <Button key="back" onClick={props.onCancel}>
        {commonLangResources.cancel}
      </Button>
      <Popconfirm
        disabled={!name}
        title={servicesLangResources.devZone.saveSecretKeyConfirm}
        placement="topRight"
        onConfirm={handleAddKeyConfirm}
        okText={commonLangResources.yes}
        cancelText={commonLangResources.no}
      >
        <Button key="submit" className="api-key-modal__ok-button" type="primary" disabled={!name}>
          {servicesLangResources.devZone.saveKeys}
        </Button>
      </Popconfirm>
    </div>}
  >
    {keyPair
      ? modalBody
      : <Spin size="large" >{modalBody}</Spin>
    }
  </Modal>;
};

export const AddApiKeyModalPure = React.memo(AddApiKeyModal);

