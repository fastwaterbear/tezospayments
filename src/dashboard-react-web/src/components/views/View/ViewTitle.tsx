import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

interface ViewTitleProps {
    className?: string;
    children?: React.ReactNode;
    as?: keyof React.ReactHTML;
}

type DefaultViewTitleProps = Required<Pick<ViewTitleProps, 'as'>>;

export const defaultProps: DefaultViewTitleProps = {
    as: 'h1',
};

const viewTitleClassName = 'view__title';
export const ViewTitle = (props: ViewTitleProps & DefaultViewTitleProps) => {
    const className = combineClassNames(props.className, viewTitleClassName);

    return React.createElement(props.as, { className }, props.children);
};
ViewTitle.defaultProps = defaultProps;
