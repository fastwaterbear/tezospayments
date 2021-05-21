import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import {
    ButtonProps, isLinkButtonProps, isNavLinkButtonProps,
    LinkButtonProps, NativeButtonProps, NavLinkButtonProps
} from './ButtonProps';
import './Button.scss';

const NativeButton = (props: NativeButtonProps) => {
    const className = combineClassNames('button', props.className);

    return <button {...props} type={props.htmlType} className={className}>{props.children}</button>;
};

const LinkButton = (props: LinkButtonProps) => {
    const className = combineClassNames('button', 'button_link', props.className);

    return <Link {...props} type={undefined} className={className}>{props.children}</Link>;
};

const NavLinkButton = (props: NavLinkButtonProps) => {
    const className = combineClassNames('button', 'button_link', props.className);

    return <NavLink {...props} type={undefined} className={className} activeClassName={'button_link_active'}>{props.children}</NavLink>;
};

export const Button = (props: ButtonProps) => isLinkButtonProps(props)
    ? <LinkButton {...props} />
    : isNavLinkButtonProps(props)
        ? <NavLinkButton {...props} />
        : <NativeButton {...props} />;

export const ButtonPure = React.memo(Button);
