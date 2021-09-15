import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { useCallback, useState } from 'react';

import { tezosMeta, Token, Service } from '@tezospayments/common';

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
  const allowedTokens: Token[] = [];
  service?.allowedTokens.assets.forEach(a => {
    const token = tokens.get(a);
    if (token) {
      allowedTokens.push(token);
    }
  });

  const items: TokenListEditorItemProps[] = [];
  if (service.allowedTokens.tez) {
    items.push({
      ticker: tezosMeta.symbol,
      name: tezosMeta.name,
      iconSrc: tezosMeta.thumbnailUri
    });
  }

  allowedTokens.forEach(t => {
    items.push({
      ticker: t.metadata?.symbol || 'unknown',
      name: t.metadata?.name || 'unknown',
      iconSrc: t.metadata?.thumbnailUri
    });
  });

  const [selectedTickers, setSelectedTickers] = useState([tezosMeta.symbol, allowedTokens[0]?.metadata?.symbol || '']);

  const handleDelete = useCallback((ticker: string) => {
    setSelectedTickers(selectedTickers.filter(t => t !== ticker));
  }, [selectedTickers]);

  const handleAdd = useCallback((ticker: string) => {
    setSelectedTickers([...selectedTickers, ticker]);
  }, [selectedTickers]);


  const selectedItems = items.filter(i => selectedTickers.some(t => t === i.ticker));
  const unSelectedItems = items.filter(i => selectedTickers.every(t => t !== i.ticker));

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
