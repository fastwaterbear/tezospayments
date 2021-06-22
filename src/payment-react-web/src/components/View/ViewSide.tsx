import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

interface ViewSideProps {
    isRight: boolean;
    className?: string;
    children?: React.ReactNode;
    as?: keyof React.ReactHTML;
}

type DefaultViewSideProps = Required<Pick<ViewSideProps, 'as'>>;

export const defaultProps: DefaultViewSideProps = {
    as: 'div'
};

const viewSideClassName = 'view__side';
export const ViewSide = (props: ViewSideProps & DefaultViewSideProps) => {
    const className = combineClassNames(
        props.className,
        viewSideClassName,
        (props.isRight ? `${viewSideClassName}_right` : `${viewSideClassName}_left`)
    );

    return React.createElement(props.as, { className }, props.children);
};
ViewSide.defaultProps = defaultProps;
