import React from 'react';

import { config } from '../../config';

interface ExplorerLinkProps {
  hash: string;
  className?: string;
  children: React.ReactNode;
}

export const ExplorerLink = (props: ExplorerLinkProps) => {
  return <a href={`${config.links.tzStats}/${props.hash}`} target="_blank" rel="noreferrer" className={props.className}>
    {props.children}
  </a>;
};

export const ExplorerLinkPure = React.memo(ExplorerLink);
