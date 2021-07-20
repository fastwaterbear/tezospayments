import { DeleteOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

import { ServiceLinkHelper } from '@tezospayments/common/dist/helpers';

import { iconIdMap } from './iconIdMap';

import './ServiceLinkEditor.scss';

interface ServiceLinkEditorProps {
  defaultValue: string;
}

const serviceLinkHelper = new ServiceLinkHelper();

export const ServiceLinkEditor = (props: ServiceLinkEditorProps) => {
  const linkInfo = serviceLinkHelper.getLinkInfo(props.defaultValue);
  if (!linkInfo) {
    return null;
  }

  const Icon = iconIdMap[linkInfo.icon];

  return <div className="service-link-editor">
    <Icon className="service-link-editor__icon" />
    <Input className="service-link-editor__input" defaultValue={props.defaultValue} />
    <Button className="service-link-editor__delete-button" type="text" danger icon={<DeleteOutlined />} />
  </div>;
};
