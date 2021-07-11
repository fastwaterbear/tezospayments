import { Tag } from 'antd';
import React from 'react';

import './CustomTag.scss';

interface CustomTagProps {
  text: string;
}

export const CustomTag = (props: CustomTagProps) => {
  return <Tag className="tag-custom">{props.text}</Tag>;
};

export const CustomTagPure = React.memo(CustomTag);
