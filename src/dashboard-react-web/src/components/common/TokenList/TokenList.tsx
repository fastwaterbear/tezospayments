import { TokenListItem } from './TokenListItem';

import './TokenList.scss';

interface TokenListProps {
  children: React.ReactNode;
}

export const TokenList = (props: TokenListProps) => {
  return <ul className="token-list">
    {props.children}
  </ul>;
};

TokenList.Item = TokenListItem;
