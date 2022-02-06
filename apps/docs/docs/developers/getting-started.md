---
sidebar_position: 1
---
# Getting Started
You can create a payment link in your web application. We provide a set of packages that helps you to generate payment links for your customers.  
To generate payment links in your web application, you’ll first need to create an API key. API Key signs your payments to allow your customer to be sure that the payment was issued by you. API Keys are created for each service. One service may have several API keys.

To create a new API key, you need:
1. Open the service through which you want to provide payments.
2. Click **Add Key**. This opens an **Add key** window.
3. In this window, enter a key name and select the preferred key type by the algorithm. The application generates a pair of keys: public and secret.  
    **Record the secret key**. This key will be used for the signing of payments in your web application. Once you click the Save Keys button, the secret key will never be shown again.

    :::caution

    If you lose your secret key, you can’t recover it and must create another one.
    
    :::

4. Click **Save Keys,** and then click **Yes**.
5. Your wallet will prompt you to confirm the operation, interaction with the service contract.

    :::caution

    Adding an API Key to a service is a blockchain operation that why it requires some Tezos tokens to be completed.
    
    :::

    Once you confirm, the new API key will be added to the service.    
6. Wait while the API Key is added to the service. On average, it takes a couple of minutes.

Now, you’re ready to generate payment links in your web application. Select your platform and follow the corresponding guide:

* [.NET 6](developers/dotnet-package/set-up.md)
* [Node.js](developers/javascript-package/set-up.md)
