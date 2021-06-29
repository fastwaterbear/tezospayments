import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { config } from '../../../config';
import { useViewTitle } from '../../hooks';
import { ViewSide } from './ViewSide';
import './View.scss';

interface ViewProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
  as?: keyof React.ReactHTML;
}

type DefaultViewProps = Required<Pick<ViewProps, 'as'>>;

const defaultProps: DefaultViewProps = {
  as: 'main'
};

export const View = (props: ViewProps & DefaultViewProps) => {
  useViewTitle(props.title ? `${props.title} | ${config.app.title}` : config.app.title);
  const className = combineClassNames('view', props.className);

  return React.createElement(props.as, { className }, props.children);
};

View.defaultProps = defaultProps;
View.Side = ViewSide;
