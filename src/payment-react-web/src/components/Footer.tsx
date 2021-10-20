import React from 'react';

import { config } from '../config';
import cssClasses from './Footer.module.scss';
import { ExternalLink } from './common';

export const Footer = () => {
  return <footer>
    <h6 className={cssClasses.label}>Powered by <ExternalLink href={config.links.tezosPayments.webSite}>Tezos Payments</ExternalLink></h6>

    <span className={cssClasses.warning}>
      All payments are made through smart contracts in
      the <ExternalLink href={config.links.tezos}>Tezos network</ExternalLink>.
      This means that they are fully decentralized and your funds go directly from your
      account to the merchant's account without the participation of third parties, includes Tezos Payments.
      Tezos Payments is just a UI <ExternalLink href={config.links.tezosPayments.gitHub}>(open-source)</ExternalLink> to
      the smart contracts, and it can't operate and control payments, can't verify accounts.
      Everybody can create their own service and accept payments, and also everybody can pay/donate to any service.
      <br />
      <span className={cssClasses['warning__highlight-message']}>So please be careful when paying.</span>
    </span>
  </footer>;
};

export const FooterPure = React.memo(Footer);
