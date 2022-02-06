---
sidebar_position: 2
---
# Accept a payment
To start accepting payments, you first need an account in the Tezos network. If you don't have one, please create it using one of the most popular wallets, e.g., [Temple](https://templewallet.com), [Kukai](https://wallet.kukai.app).  
If you have it, you're ready to move on.

:::info

You need some amount of Tezos to pay network fees while communicating with your services, through which payments will be made.

:::

## Step 1: Connect a Tezos account to the Dashboard application
1. Open the dashboard app by the following URL:  
[https://dashboard.tezospayments.com](https://dashboard.tezospayments.com)
2. Click **Connect**.
3. Choose the wallet that you are using.
4. In your wallet, click **Connect** / **Approve** / **Confirm**.

Once you approve the connection, you'll be connected to the Tezos Payments Dashboard application and ready to use that.

## Step 2: Create a service
Service is a component that accepts funds from your customers and sends them to you. Also, the service keeps public information about your online shop (your site, social media account, etc.) and shows it to your customers when they make payments.

1. Click **Create Service** or open the Create Service page by this URL:  
[https://dashboard.tezospayments.com/services/create](https://dashboard.tezospayments.com/services/create)
2. Fill in public information that your customers will be seen when paying:

    * **Service Name** - it can be the name of your online shop or any identifier helping the customers make sure they're making the right payment.  
    The field is required.
    * **Description** - a short description of your shop, site, etc.  
    The field is optional.
    * **Links** - links to your site, social media, or other links.  
    This field is optional.
    * **Allowed Currencies** - choose currencies in which you can create payments. When you'll create a payment you have to choose one currency from this list.  
    At least one currency is required.

    <br />

    :::caution

    Public information about your service will be stored on the Tezos blockchain, so it'll be available to everyone at all times. You   won't be able to delete this information.
    Please be careful when you fill in this information.

    :::

3. Verify the filled information for correctness.
4. Click **Create Service**.
5. Your wallet will prompt you to confirm the operation, which is an interaction with the Tezos Payments Factory Contract.
    
    :::info

    Creating a service is a blockchain operation that why it requires some Tezos tokens to be completed.

    :::
    
    Once you confirm, you'll launch creating the service.

6. Wait while the service is being created. Usually, it takes a couple of minutes.
7. Once the service has been created, you can go to the next step.

## Step 3: Create a payment
You can create a payment by two approaches:

1. Manually, using the Dashboard application. It's suitable for those who sell products manually using social media and don't have their own sites.
2. Automatically, using the API provided by the Tezos Payments packages on your server. It's suitable for those who have their own sites.

Next, we'll look a the Manual approach. Read about the second approach in the [Developers guide](developers/getting-started.md).

1. Click **Accept Payments** or open the Accept Payments page by the following URL:  
[https://dashboard.tezospayments.com/accept](https://dashboard.tezospayments.com/accept).
2. Choose the service through that payments will be made.
3. Choose the currency and enter the amount of payment.
4. Fill in the payment data:
    * **Payment ID** - it's a unique identifier that helps you match the completed operation (payment) with your customer's order, purchase, and so forth.  
    The field is required.

5. Verify the filled information for correctness.
6. Click **Generate and Sign Payment Link**.
7. Your wallet will prompt you to sign payment encoded data. The signing of the payment is required to prove that the payment really was created by you.
8. Once you sign the payment, you'll see a generated payment link like this:  
*<span>https</span>://payment.tezospayments.com/#00eyJpIjoiMHlnQWh3TVdIX2....*
9. Share the payment link with your customer.

After that, your customer can make the payment by your generated link.

## Step 4: Track a payment
When your customer make a payment, you can check it on the Operations page by this link:  
[https://dashboard.tezospayments.com/operations](https://dashboard.tezospayments.com/operations)  
Find an operation by the payment id. Make sure that the operation has completed status.
