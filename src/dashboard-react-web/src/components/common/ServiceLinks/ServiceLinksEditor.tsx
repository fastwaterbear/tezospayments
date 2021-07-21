import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useCallback } from 'react';

import { useCurrentLanguageResources } from '../../hooks';
import { ServiceLinkEditor } from './ServiceLinkEditor';

import './ServiceLinksEditor.scss';

interface ServiceLinksEditorProps {
  value: string[];
  onChange: (e: { value: string[] }) => void;
}

export const ServiceLinksEditor = (props: ServiceLinksEditorProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const handleDelete = useCallback((i: number) => {
    const value = [...props.value];
    value.splice(i, 1);
    props.onChange({ value });
  }, [props]);

  const editors = props.value.map((l, i) => <ServiceLinkEditor key={l} value={l} onDelete={() => handleDelete(i)} />);

  return <div className="service-links-editor">
    {editors}
    <Button className="service-links-editor__button" icon={<PlusOutlined />}>
      {servicesLangResources.editing.addLink}
    </Button>
  </div>;
};
