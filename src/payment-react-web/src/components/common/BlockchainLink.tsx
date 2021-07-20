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

export const BlockchainLink = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children, option, showCopyButton, className: classNameProp, longLinkClassName: longLinkClassNameProp,
  shortLinkClassName: shortLinkClassNameProp, ...externalLinkProps
}: BlockchainLinkProps & DefaultBlockchainLinkProps) => {
  const className = combineClassNames(
    classNameBase,
    classNameProp
  );
  const longLinkClassName = combineClassNames(
    `${classNameBase}__link_length-full`,
    longLinkClassNameProp
  );
  const shortLinkClassName = combineClassNames(
    `${classNameBase}__link_length-short`,
    shortLinkClassNameProp
  );

  return <div className={className}>
    <ExternalLink {...externalLinkProps} className={longLinkClassName}>
      {children}
    </ExternalLink>
    <ExternalLink {...externalLinkProps} className={shortLinkClassName}>
      {getShortHash(children)}
    </ExternalLink>
    {showCopyButton && <CopyButtonPure copyText={children} />}
  </div>;
};
BlockchainLink.defaultProps = defaultProps;

export const BlockchainLinkPure = React.memo(BlockchainLink);
