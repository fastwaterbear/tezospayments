import { CopyOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Modal, Radio } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useCallback, useRef } from 'react';

import { useCurrentLanguageResources } from '../../../../hooks';

import './AddApiKeyModal.scss';

interface AddApiKeyModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const AddApiKeyModal = (props: AddApiKeyModalProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const algorithmOptions = [
    { label: 'Ed25519', value: 'Ed25519' },
    { label: 'Secp256k1', value: 'Secp256k1' },
    { label: 'P256', value: 'P256' },
  ];

  const publicKey = 'edpkvQXtVcy8YrBLmMhn8EDt4Zb46TWZX1QUxxepFzJgsWU6YKadJP';
  const secretKey = 'edskRwse4Z8ZZNCC7xzCEUrTBtCeEPhv8gfBiWrE8cysRQpz45HCQjChdDckNEBZZMCxjPMkHhmGkUnwBs22cKr2nrwiGfQHsP';

  const publicKeyRef = useRef<Input>(null);
  const secretKeyRef = useRef<Input>(null);

  const handleCopyClick = useCallback((ref: React.RefObject<Input>) => {
    const input = ref.current;
    if (input) {
      input.select();
      navigator.clipboard.writeText(input.state.value);
    }
  }, []);

  return <Modal className="api-key-modal" title={servicesLangResources.devZone.addKey} centered destroyOnClose visible={props.visible} onCancel={props.onCancel} okText={'Add'} >
    <span className="api-key-modal__label">Name:</span>
    <Input autoFocus />
    <span className="api-key-modal__label">Algorithm:</span>
    <Radio.Group options={algorithmOptions} value={algorithmOptions[0]?.value} />
    <Divider />
    <span className="api-key-modal__label">Public Key:</span>
    <Search ref={publicKeyRef} readOnly value={publicKey} enterButton={<Button icon={<CopyOutlined />} />} onSearch={() => handleCopyClick(publicKeyRef)} />
    <span className="api-key-modal__label">Secret Key:</span>
    <Search ref={secretKeyRef} readOnly value={secretKey} enterButton={<Button icon={<CopyOutlined />} />} onSearch={() => handleCopyClick(secretKeyRef)} />
    <span className="api-key-modal__warning-hint">Save the secret key, we will never show it again</span>
  </Modal>;
};

export const AddApiKeyModalPure = React.memo(AddApiKeyModal);
