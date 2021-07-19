import React from 'react';

import { combineClassNames } from '@tezospayments/common/dist/utils';


import { CopyButtonPure } from './CopyButton';
import { ExternalLink } from './ExternalLink';
import './BlockchainLink.scss';

export enum BlockchainLinkOption {
  OnlyLong = 1,
  OnlyShort = 2,
  ShortAndLong = 3
}

type BlockchainLinkProps = Omit<React.ComponentProps<typeof ExternalLink>, 'children' | 'className'> &
{
  children: string;
  option?: BlockchainLinkOption;
  showCopyButton?: boolean;
  className?: string;
  longLinkClassName?: string;
  shortLinkClassName?: string;
};

type DefaultBlockchainLinkProps = Required<Pick<BlockchainLinkProps, 'option' | 'showCopyButton'>>;

const defaultProps: DefaultBlockchainLinkProps = {
  option: BlockchainLinkOption.ShortAndLong,
  showCopyButton: true
};

const classNameBase = 'blockchain-link';

// TODO: extract into the common utils.text
const getShortHash = (hash: string) => `${hash.substr(0, 9)}...${hash.substr(hash.length - 6, 6)}`;

export const BlockchainLink = (props: BlockchainLinkProps & DefaultBlockchainLinkProps) => {
  const className = combineClassNames(
    classNameBase,
    props.className
  );
  const longLinkClassName = combineClassNames(
    `${classNameBase}__link_length-full`,
    props.longLinkClassName
  );
  const shortLinkClassName = combineClassNames(
    `${classNameBase}__link_length-short`,
    props.longLinkClassName
  );

  return <div className={className}>
    <ExternalLink {...props} className={longLinkClassName}>
      {props.children}
    </ExternalLink>
    <ExternalLink {...props} className={shortLinkClassName}>
      {getShortHash(props.children)}
    </ExternalLink>
    {props.showCopyButton && <CopyButtonPure copyText={props.children} />}
  </div>;
};
BlockchainLink.defaultProps = defaultProps;

export const BlockchainLinkPure = React.memo(BlockchainLink);
