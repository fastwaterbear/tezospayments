import { NavLinkProps } from 'react-router-dom';

export type ButtonType = 'default' | 'link' | 'nav-link';

export interface ButtonPropBase {
    type?: ButtonType;
    className?: string;
    children?: React.ReactNode;
}

export type NativeButtonProps = ButtonPropBase & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    type?: 'default';
    htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onClick?: React.MouseEventHandler<HTMLElement>;
};

export type LinkButtonProps = ButtonPropBase & Omit<NavLinkProps, 'type' | 'href'> & {
    type: 'link';
};

export type NavLinkButtonProps = ButtonPropBase & Omit<NavLinkProps, 'type' | 'href'> & {
    type: 'nav-link';
};

export type ButtonProps = LinkButtonProps | NativeButtonProps | NavLinkButtonProps;

export const isLinkButtonProps = (props: ButtonProps): props is LinkButtonProps => {
    return props.type === 'link';
};

export const isNavLinkButtonProps = (props: ButtonProps): props is NavLinkButtonProps => {
    return props.type === 'nav-link';
};
