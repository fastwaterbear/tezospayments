import { CopyOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Radio, RadioChangeEvent, Typography, Popconfirm } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Service } from '@tezospayments/common/src';

import { addApiKey } from '../../../../../store/services/slice';
import { useCurrentLanguageResources } from '../../../../hooks';

import './AddApiKeyModal.scss';

interface AddApiKeyModalProps {
  service: Service;
  visible: boolean;
  onCancel: () => void;
}

export const AddApiKeyModal = (props: AddApiKeyModalProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const servicesLangResources = langResources.views.services;
  const dispatch = useDispatch();

  const algorithmOptions = [
    { label: 'Ed25519', value: 'Ed25519' },
    { label: 'Secp256k1', value: 'Secp256k1' },
    { label: 'P256', value: 'P256' },
  ];

  const [algorithType, setAlgorithType] = useState(algorithmOptions[0]?.value || '');
  const handleAlgorithTypeChanges = useCallback((e: RadioChangeEvent) => {
    setAlgorithType(e.target.value);
  }, []);

  const [name, setName] = useState('');
  const handleNameChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const [publicKey, secretKey] = getKeys(algorithType);

  const publicKeyRef = useRef<Input>(null);
  const secretKeyRef = useRef<Input>(null);

  const handleCopyClick = useCallback((ref: React.RefObject<Input>) => {
    const input = ref.current;

    if (input) {
      input.select();
      navigator.clipboard.writeText(input.state.value);
    }
  }, []);

  const handleAddKeyConfirm = useCallback(() => {
    dispatch(addApiKey({ service: props.service, signingKey: { name, publicKey } }));
  }, [dispatch, name, props.service, publicKey]);

  return <Modal className="api-key-modal" title={servicesLangResources.devZone.addKey} centered destroyOnClose visible={props.visible}
    onCancel={props.onCancel}
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
    <span className="api-key-modal__label">{servicesLangResources.devZone.name}:</span>
    <Input autoFocus value={name} onChange={handleNameChanged} />
    <span className="api-key-modal__label">{servicesLangResources.devZone.algorithm}:</span>
    <Radio.Group options={algorithmOptions} value={algorithType} onChange={handleAlgorithTypeChanges} />
    <Divider />
    <span className="api-key-modal__label">{servicesLangResources.devZone.publicKey}:</span>
    <Search ref={publicKeyRef} readOnly value={publicKey} enterButton={<Button icon={<CopyOutlined />} />} onSearch={() => handleCopyClick(publicKeyRef)} />
    <span className="api-key-modal__label">{servicesLangResources.devZone.secretKey}:</span>
    <Search ref={secretKeyRef} readOnly value={secretKey} enterButton={<Button icon={<CopyOutlined />} />} onSearch={() => handleCopyClick(secretKeyRef)} />
    <Typography.Text mark>{servicesLangResources.devZone.saveSecretKeyWarning}</Typography.Text>
  </Modal>;
};

export const AddApiKeyModalPure = React.memo(AddApiKeyModal);

const getKeys = (type: string): [string, string] => {
  switch (type) {
    case 'Ed25519':
      return ['edpkvQXtVcy8YrBLmMhn8EDt4Zb46TWZX1QUxxepFzJgsWU6YKadJP', 'edskRwse4Z8ZZNCC7xzCEUrTBtCeEPhv8gfBiWrE8cysRQpz45HCQjChdDckNEBZZMCxjPMkHhmGkUnwBs22cKr2nrwiGfQHsP'];
    case 'Secp256k1':
      return ['sppk7cjayJkatAA6Kzd9w6DSRrRDq6JoRAfugi1fqahpyjCBRCLGfob', 'spsk1VyxSVYfX3CfNpSNDxBdR97LnAdQA59jWpc4HYXtYg1cX53V6Y'];
    case 'P256':
      return ['p2pk65H621C6fgfcuhiUcQmx3GRz8iNxjzMB1BG2WQKAYKEcbVzyJMD', 'p2sk2yHAwhsLaRCm8zAfN4K1Py7fBhxgR1kAB5SCYn9yGWofkjqNTN'];

    default:
      throw new Error('Unknown algorithm type');
  }
};
