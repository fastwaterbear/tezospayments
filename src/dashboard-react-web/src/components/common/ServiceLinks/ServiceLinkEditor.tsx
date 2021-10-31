import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useCallback } from 'react';

import { ServiceLinkHelper } from '@tezospayments/common';

import { iconIdMap } from './iconIdMap';

import './ServiceLinkEditor.scss';

interface ServiceLinkEditorProps {
  value: string;
  readOnly: boolean;
  onChange: (e: { value: string }) => void
  onDelete: () => void;
}

const serviceLinkHelper = new ServiceLinkHelper();

export const ServiceLinkEditor = (props: ServiceLinkEditorProps) => {
  const linkInfo = serviceLinkHelper.getLinkInfo(props.value, true);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange({ value: e.target.value });
  }, [props]);

  if (!linkInfo) {
    return null;
  }

  const Icon = iconIdMap[linkInfo.icon];

  return <div className="service-link-editor">
    <Icon className="service-link-editor__icon" />
    <Input readOnly={props.readOnly} className="service-link-editor__input" value={props.value} onChange={handleChange} />
    <Button disabled={props.readOnly} className="service-link-editor__delete-button" type="text" danger icon={<DeleteOutlined />} onClick={props.onDelete} />
  </div>;
};
