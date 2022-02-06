---
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generate a payment link
First, make sure that you have set up TezosPayments as described in the Set Up chapter.

## Create a payment in tez tokens
To create a payment, you need to call the `createPayment` method of the `TezosPayments` class passing `PaymentCreateParameters`:

<Tabs>
<TabItem value="typescript" label="TypeScript">

```ts
const payment = await tezospayments.createPayment({
  amount: '10'
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>

<TabItem value="javascript" label="JavaScript">

```js
const payment = await tezospayments.createPayment({
  amount: '10'
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>
</Tabs>

Where `'10'` is an amount of tez tokens. The amount should be represented by a string.

## Create a payment in FA tokens
To create a payment, you need to call the `createPayment` method of the `TezosPayments ` class passing `PaymentCreateParameters` with a FA-token metadata:

<Tabs>
<TabItem value="typescript" label="TypeScript">

```ts {3-7}
const payment = await tezospayments.createPayment({
  amount: '50.17',
  asset: {
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    decimals: 18,
    id: null
  }
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>

<TabItem value="javascript" label="JavaScript">

```js {3-7}
const payment = await tezospayments.createPayment({
  amount: '50.17',
  asset: {
    address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
    decimals: 18,
    id: null
  }
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>
</Tabs>

You need to pass the FA-token metadata to the `asset` object:
1. `address: string`. An address of the token contract;
2. `decimals: number`. A number of decimals;
3. `id: number | null`. If it is a FA 1.2 token, pass `null`.

`'50.17'` is an amount of target tokens. The amount should be represented by a string.

## Create a payment with a client data
If you want to pass some data to the payment form, you need to set the `data` field of `PaymentCreateParameters`:

<Tabs>
<TabItem value="typescript" label="TypeScript">

```ts {3-6}
const payment = await tezospayments.createPayment({
  amount: '100',
  data: {
    item: 'Watch',
    count: 3
  }
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>

<TabItem value="javascript" label="JavaScript">

```js {3-6}
const payment = await tezospayments.createPayment({
  amount: '100',
  data: {
    item: 'Watch',
    count: 3
  }
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>
</Tabs>

The type of the `data` field should be any object that can be serialized as JSON.

:::info

The data will only be displayed in the payment form and **won’t be stored** in the blockchain.

:::

## Create a payment with the custom ID
By default, the TezosPayments package generates a payment ID automatically. But if you want to use the custom ID, you need to pass this ID with `PaymentCreateParameters`:

<Tabs>
<TabItem value="typescript" label="TypeScript">

```ts  {3}
const payment = await tezospayments.createPayment({
  amount: '11',
  id: 'customId'
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>

<TabItem value="javascript" label="JavaScript">

```js  {3}
const payment = await tezospayments.createPayment({
  amount: '11',
  id: 'customId'
});
// Your customers can use this link to make the payment
console.log(payment.url);
```

</TabItem>
</Tabs>

:::info

Payment ID - it's a unique identifier that helps you match the completed operation (payment) with your customer's order, purchase, and so forth.

:::
