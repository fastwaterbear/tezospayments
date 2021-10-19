import { CopyOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

import { useAppContext, useCurrentLanguageResources } from '../../hooks';

import './ExplorerLink.scss';

interface ExplorerLinkProps {
  hash: string;
  className?: string;
  showCopyButton?: boolean;
  children: React.ReactNode;
}

export const ExplorerLink = (props: ExplorerLinkProps) => {
  const appContext = useAppContext();
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;

  const handleCopyAddressClick = useCallback(() => {
    navigator.clipboard.writeText(props.hash);
  }, [props.hash]);

  return <div className="explorer-link__container">
    <a href={appContext.tezosExplorer.getOperationUrl(props.hash)} target="_blank" rel="noreferrer" className={props.className}>
      {props.children}
    </a>
    {props.showCopyButton && <CopyOutlined className="explorer-link__copy-icon" title={commonLangResources.copy} onClick={handleCopyAddressClick} />}
  </div>;
};

export const ExplorerLinkPure = React.memo(ExplorerLink);
