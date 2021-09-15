import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { useCallback, useState } from 'react';

import { tezosMeta, Service } from '@tezospayments/common';

import { selectTokensState } from '../../../../../store/services/selectors';
import { TokenListItem } from '../../../../common/TokenList/TokenListItem';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

import './TokensEditor.scss';

interface TokensEditorProps {
  service: Service
}

interface TokenListEditorItemProps {
  name: string;
  ticker: string;
  iconSrc?: string;
}

export const TokensEditor = ({ service }: TokensEditorProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const tokens = useAppSelector(selectTokensState);
  const allowedTokens = Array.from(tokens.values());
  const defaultSelectedTickers: string[] = [];

  service?.allowedTokens.assets.forEach(a => {
    const token = tokens.get(a);
    if (token) {
      defaultSelectedTickers.push(token.metadata?.symbol || '');
    }
  });

  const items: Map<string, TokenListEditorItemProps> = new Map();
  if (service.allowedTokens.tez) {
    items.set(tezosMeta.symbol, {
      ticker: tezosMeta.symbol,
      name: tezosMeta.name,
      iconSrc: tezosMeta.thumbnailUri
    });
  }

  allowedTokens.forEach(t => {
    items.set(t.metadata?.symbol || 'unknown', {
      ticker: t.metadata?.symbol || 'unknown',
      name: t.metadata?.name || 'unknown',
      iconSrc: t.metadata?.thumbnailUri
    });
  });

  const [selectedTickers, setSelectedTickers] = useState([tezosMeta.symbol, ...defaultSelectedTickers]);

  const handleDelete = useCallback((ticker: string) => {
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  }, [selectedTickers]);

  const handleAdd = useCallback((ticker: string) => {
    setSelectedTickers([...selectedTickers, ticker]);
  }, [selectedTickers]);

  const selectedItems = selectedTickers.map(t => items.get(t) as TokenListEditorItemProps);
  const unSelectedItems = Array.from(items.values()).filter(i => selectedTickers.every(t => t !== i.ticker));

  const menu = <Menu>
    {unSelectedItems.map(i => <Menu.Item className="token-list-editor-menu-item" key={i.ticker} onClick={() => handleAdd(i.ticker)}>
      <img className="token-list-editor-menu-item__icon" src={i.iconSrc} alt={i.name} />
      <span className="token-list-editor-menu-item__ticker">{i.ticker}</span>
      <span className="token-list-editor-menu-item__name">{i.name}</span>
    </Menu.Item >)}
  </Menu>;

  return <>
    <ul className="token-list-editor">
      {selectedItems.map(i => <TokenListItem className="token-list-editor__item" key={i.ticker} name={i.name}
        ticker={i.ticker} iconSrc={i.iconSrc} handleDelete={i.ticker !== tezosMeta.symbol ? handleDelete : undefined} />)}
    </ul>

    {unSelectedItems.length > 0 && <Dropdown trigger={['click']} overlay={menu} placement="bottomCenter">
      <Button className="token-list-editor__add-button" icon={<PlusOutlined />}>
        {servicesLangResources.editing.addCurrency}
      </Button>
    </Dropdown>}
  </>;
};
