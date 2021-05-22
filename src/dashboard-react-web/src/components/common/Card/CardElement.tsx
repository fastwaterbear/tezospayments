import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

interface CardElementProps {
    elementClassName: string;
    externalClassName?: string;
    children?: React.ReactNode;
    as?: keyof React.ReactHTML;
}

type DefaultCardElementProps = Required<Pick<CardElementProps, 'as'>>;

export const defaultProps: DefaultCardElementProps = {
    as: 'div'
};

export const CardElement = (props: CardElementProps & DefaultCardElementProps) => {
    const className = combineClassNames(props.elementClassName, props.externalClassName);

    return React.createElement(props.as, { className }, props.children);
};

export type PublicCardElementProps = Omit<CardElementProps, 'elementClassName' | 'externalClassName'>
    & { className?: string };

CardElement.defaultProps = defaultProps;
