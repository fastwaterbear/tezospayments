import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardPreview } from './CardPreview';
import './Card.scss';

interface CardProps {
    className?: string;
    children?: React.ReactNode;
    as?: keyof React.ReactHTML;
    clickable?: boolean;

    onClick?: () => void;
}

type DefaultCardProps = Required<Pick<CardProps, 'as' | 'clickable'>>;

const defaultProps: DefaultCardProps = {
    as: 'section',
    clickable: false
};

export const Card = (props: CardProps & DefaultCardProps) => {
    const className = combineClassNames(
        'card',
        props.clickable ? 'card-clickable' : undefined,
        props.className
    );

    return React.createElement(props.as, { className, onClick: props.onClick }, props.children);
};

Card.defaultProps = defaultProps;
Card.Preview = CardPreview;
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export const CardPure = React.memo(Card);
