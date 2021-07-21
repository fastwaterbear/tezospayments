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

  const handleChange = useCallback((i: number, e: { value: string }) => {
    const value = [...props.value];
    value[i] = e.value;
    props.onChange({ value });
  }, [props]);

  const handleDelete = useCallback((i: number) => {
    const value = [...props.value];
    value.splice(i, 1);
    props.onChange({ value });
  }, [props]);

  const handleAdd = useCallback(() => {
    const value = [...props.value, 'https://bbb.com'];
    props.onChange({ value });
  }, [props]);

  const editors = props.value.map((l, i) => <ServiceLinkEditor key={i} value={l} onDelete={() => handleDelete(i)} onChange={e => handleChange(i, e)} />);

  return <div className="service-links-editor">
    {editors}
    <Button className="service-links-editor__button" icon={<PlusOutlined />} onClick={handleAdd}>
      {servicesLangResources.editing.addLink}
    </Button>
  </div >;
};
