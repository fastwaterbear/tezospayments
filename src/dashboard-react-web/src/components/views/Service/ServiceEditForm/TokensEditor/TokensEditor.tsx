import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { useCallback, useState } from 'react';

import { tezosMeta, Service } from '@tezospayments/common';

import { selectTokensState } from '../../../../../store/services/selectors';
import { TokenListItem } from '../../../../common/TokenList/TokenListItem';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

import './TokensEditor.scss';

interface TokensEditorProps {
  allowedTokens: Service['allowedTokens'];
  onChange: (allowedTokens: Service['allowedTokens']) => void;
}

interface TokenListEditorItemProps {
  name: string;
  address: string;
  ticker: string;
  iconSrc?: string;
}

export const TokensEditor = (props: TokensEditorProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const tokens = useAppSelector(selectTokensState);
  const selectedAddresses: string[] = [];

  if (props.allowedTokens.tez) {
    selectedAddresses.push('');
  }

  props.allowedTokens.assets.forEach(a => {
    const token = tokens.get(a);
    if (token) {
      selectedAddresses.push(token.contractAddress);
    }
  });

  const allItems: Map<string, TokenListEditorItemProps> = new Map();
  allItems.set('', {
    ticker: tezosMeta.symbol,
    address: '',
    name: tezosMeta.name,
    iconSrc: tezosMeta.thumbnailUri
  });

  const allTokens = Array.from(tokens.values());
  allTokens.forEach(t => {
    if (t.metadata) {
      allItems.set(t.contractAddress, {
        ticker: t.metadata.symbol,
        address: t.contractAddress,
        name: t.metadata.name,
        iconSrc: t.metadata.thumbnailUri
      });
    }
  });

  const handleTokensChanged = useCallback((addresses: string[]) => {
    props.onChange({
      tez: addresses.some(a => a === ''),
      assets: addresses.filter(a => !!a)
    });
  }, [props]);

  const handleAdd = useCallback((address: string) => handleTokensChanged([...selectedAddresses, address]), [handleTokensChanged, selectedAddresses]);
  const handleDelete = useCallback((address: string) => handleTokensChanged(selectedAddresses.filter(a => a !== address)), [handleTokensChanged, selectedAddresses]);

  const selectedItems = selectedAddresses.map(t => allItems.get(t) as TokenListEditorItemProps);
  const unSelectedItems = Array.from(allItems.values()).filter(i => selectedAddresses.every(t => t !== i.address));

  const menu = <Menu>
    {unSelectedItems.map(i => <Menu.Item className="token-list-editor-menu-item" key={i.ticker} onClick={() => handleAdd(i.address)}>
      <img className="token-list-editor-menu-item__icon" src={i.iconSrc} alt={i.name} />
      <span className="token-list-editor-menu-item__ticker">{i.ticker}</span>
      <span className="token-list-editor-menu-item__name">{i.name}</span>
    </Menu.Item >)}
  </Menu>;

  return <>
    <ul className="token-list-editor">
      {selectedItems.map(i => <TokenListItem className="token-list-editor__item" key={i.address} name={i.name} contractAddress={i.address}
        ticker={i.ticker} iconSrc={i.iconSrc} handleDelete={handleDelete} />)}
    </ul>

    {unSelectedItems.length > 0 && <Dropdown trigger={['click']} overlay={menu} placement="bottomCenter">
      <Button className="token-list-editor__add-button" icon={<PlusOutlined />}>
        {servicesLangResources.editing.addCurrency}
      </Button>
    </Dropdown>}
  </>;
};
