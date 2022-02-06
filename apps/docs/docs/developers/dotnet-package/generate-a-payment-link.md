---
sidebar_position: 2
---
# Generate a payment link
First, make sure that you have set up `TezosPaymentsClient` as described in the [Set Up chapter](developers/dotnet-package/set-up.md).

## Create a payment in tez tokens
To create a payment, you need to call the `CreatePaymentAsync` method of the `ITezosPaymentsClient` type passing `PaymentCreateParameters`:

```cs
using TezosPayments;

// ...

var payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10"));
// Your customers can use this link to make the payment
Console.WriteLine(payment.Url);
```

Where `"10"` is an amount of tez tokens. The amount should be represented by a string.  
If you pass a decimal amount, you need to control the floating point. Native tokens of Tezos have **6** decimals. The TezosPayments package adds trailing zeros or removes excess digits automatically:

```cs
using TezosPayments;

// ...

var payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10"));
// 10.000000
Console.WriteLine(payment.Amount);

payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10.123"));
// 10.123000
Console.WriteLine(payment.Amount);

payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10.123456"));
// 10.123456
Console.WriteLine(payment.Amount);

// ❌ Accuracy will be lost
// 10.123456789 → 10.123456
payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10.123456789"));
// 10.123456
Console.WriteLine(payment.Amount);
```

## Create a payment in FA tokens
To create a payment, you need to call the `CreatePaymentAsync` method of the `ITezosPaymentsClient` type passing `PaymentCreateParameters` with a FA-token metadata:

```cs {7}
using TezosPayments;

// ...

var payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("50.17")
{
    Asset = new PaymentAsset("KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV", 18, null)
});
// Your customers can use this link to make the payment
Console.WriteLine(payment.Url);
```

You need to pass the FA-token metadata to the constructor of the `PaymentAsset` class:
1. `string tokenAddress`. An address of the token contract;
2. `ushort decimals`. A number of decimals;
3. `ulong? id`. If it is a FA 1.2 token, pass `null`.

`"50.17"` is an amount of target tokens. The amount should be represented by a string.  
If you pass a decimal amount, you need to control the floating point. The TezosPayments package adds trailing zeros or removes excess digits automatically:

```cs
using TezosPayments;

// ...

var asset = new PaymentAsset("KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf", 6, 0);
var payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10")
{
    Asset = asset
});
// 10.000000
Console.WriteLine(payment.Amount);

payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10.123")
{
    Asset = asset
});
// 10.123000
Console.WriteLine(payment.Amount);

payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10.123456")
{
    Asset = asset
});
// 10.123456
Console.WriteLine(payment.Amount);

// ❌ Accuracy will be lost
// 10.123456789 → 10.123456
payment = await tezosPaymentsClient.CreatePaymentAsync(new PaymentCreateParameters("10.123456789")
{
    Asset = asset
});
// 10.123456
Console.WriteLine(payment.Amount);
```

## Create a payment with a client data
If you want to pass some data to the payment form, you need to set the `Data` property of `PaymentCreateParameters`:

```cs {7-11}
using TezosPayments;

// ...

var payment = await tezosPaymentsClient.CreatePaymentAsync(new("100")
{
    Data = new
    {
        Item = "Watch",
        Count = 3
    }
});
// Your customers can use this link to make the payment
Console.WriteLine(payment.Url);
```

The type of the `Data` property should be any object that can be serialized as JSON.

:::info

The data will only be displayed in the payment form and **won’t be stored** in the blockchain.

:::

## Create a payment with the custom ID
By default, the TezosPayments package generates a payment ID automatically. But if you want to use the custom ID, you need to pass this ID with `PaymentCreateParameters`:

```cs {7}
using TezosPayments;

// ...

var payment = await tezosPaymentsClient.CreatePaymentAsync(new("11")
{
    Id = "customId"
});
// Your customers can use this link to make the payment
Console.WriteLine(payment.Url);
```

:::info

Payment ID - it's a unique identifier that helps you match the completed operation (payment) with your customer's order, purchase, and so forth.

:::
