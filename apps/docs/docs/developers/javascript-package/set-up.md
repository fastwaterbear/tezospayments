---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set up
The Tezos Payments JavaScript package supports Node.js 16.7.0 or later. Make sure that you have the supported version:
```bash
node --version
```

## Install the JavaScript package
Add the package to your project:

<Tabs>
<TabItem value="npm" label="NPM">

```bash
npm install --save tezospayments
```

</TabItem>

<TabItem value="yarn" label="Yarn">

```bash
yarn add tezospayments
```

</TabItem>
</Tabs>

## Set up the Tezos Payments
Tezos Payments (`TezosPayments`) is a class with which you’ll create payment links. One instance is used for one service.  
Create an instance of the `TezosPayments` class:

<Tabs>
<TabItem value="typescript" label="TypeScript">

```ts
import { TezosPayments } from 'tezospayments';

// ...

const tezospayments = new TezosPayments({
  serviceContractAddress: '<contract address of your service>',
  signing: {
    apiSecretKey: '<API secret key of this service>'
  }
});
```

</TabItem>

<TabItem value="javascript" label="JavaScript">

```js
const { TezosPayments } = require('tezospayments');

// ...

const tezospayments = new TezosPayments({
  serviceContractAddress: '<contract address of your service>',
  signing: {
    apiSecretKey: '<API secret key of this service>'
  }
});
```

</TabItem>
</Tabs>

If you need to specify a network use the network option:

<Tabs>
<TabItem value="typescript" label="TypeScript">

```ts
import { TezosPayments } from 'tezospayments';

// ...

const tezospayments = new TezosPayments({
  serviceContractAddress: '<contract address of your service>',
  signing: {
    apiSecretKey: '<API secret key of this service>'
  },
  network: { name: 'hangzhounet' }
});
```

</TabItem>

<TabItem value="javascript" label="JavaScript">

```js
const { TezosPayments } = require('tezospayments');

// ...

const tezospayments = new TezosPayments({
  serviceContractAddress: '<contract address of your service>',
  signing: {
    apiSecretKey: '<API secret key of this service>'
  },
  network: { name: 'hangzhounet' }
});
```

</TabItem>
</Tabs>
