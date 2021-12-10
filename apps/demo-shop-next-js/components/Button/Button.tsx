import React from 'react';

import { combineClassNames } from '../../utils';
import cssClasses from './Button.module.css';

type ButtonType = 'primary' | 'secondary';

interface ButtonProps {
  type: ButtonType;
  className?: string;
  children?: React.ReactNode;
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const Button = (props: ButtonProps) => {
  const className = combineClassNames(cssClasses.button, cssClasses[`button_${props.type}`], props.className);

  return <button {...props} type={props.htmlType} className={className}>{props.children}</button>;
};

export const ButtonPure = React.memo(Button);
