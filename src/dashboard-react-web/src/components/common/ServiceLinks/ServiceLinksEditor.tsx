import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useCurrentLanguageResources } from '../../hooks';
import { ServiceLinkEditor } from './ServiceLinkEditor';

import './ServiceLinksEditor.scss';

interface ServiceLinksEditorProps {
  defaultValue: string[];
}

export const ServiceLinksEditor = (props: ServiceLinksEditorProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;
  const editors = props.defaultValue.map((l, i) => <ServiceLinkEditor key={i} defaultValue={l} />);

  return <div className="service-links-editor">
    {editors}
    <Button className="service-links-editor__button" icon={<PlusOutlined />}>
      {servicesLangResources.editing.addLink}
    </Button>
  </div>;
};
