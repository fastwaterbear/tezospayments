---
sidebar_position: 2
---
# Working with services
Service is a component that accepts funds from your customers and sends them to you. Also, the service shows your customers public information about your online shop (your site, social media account, etc.) when the customers make payments.

:::info

A service is a smart contract in the Tezos blockchain, so it’ll always exist. If you need to stop accepting payments through a service, you need to archive the service.

:::

## Create a service
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

## Update a service
1. Open the service page navigating in the Dashboard application.
Click **Services**, then click on the service which you want to update.
2. Update the service information. Verify the filled information for correctness.
3. Click **Update Service**.
4. Your wallet will prompt you to confirm the operation, which is an interaction with the Tezos Payments Factory Contract.
    
    :::info

    Updating a service is a blockchain operation that why it requires some Tezos tokens to be completed.

    :::

    Once you confirm, you'll launch updating the service.

5. Wait while the service is being updated. On average, it takes a couple of minutes.

## Pause a service
If you temporarily want to pause accepting payments through a particular service, you may pause this service.

1. Open the service page navigating in the Dashboard application.
Click **Services**, then click on the service which you want to pause.
2. Click **Pause Service**
3. Your wallet will prompt you to confirm the operation, interaction with the service contract.
    
    :::info
    
    Pausing a service is a blockchain operation that why it requires some Tezos tokens to be completed.
    
    :::info

    Once you confirm, you’ll launch pausing the service.

4. Wait while the service will be paused. On average, it takes a couple of minutes.

## Resume a service
If you want to start accepting payments through a paused service, you must resume this service.

1. Open the service page navigating in the Dashboard application.
Click **Services**, then click on paused service, which you want to resume.
2. Click **Unpause Service**
3. Your wallet will prompt you to confirm the operation, interaction with the service contract.
    
    :::info
    
    Resuming a service is a blockchain operation that why it requires some Tezos tokens to be completed.
    
    :::info

    Once you confirm, you’ll launch resuming the service.
    
4. Wait while the service is being resumed. On average, it takes a couple of minutes.

## Archive a service
If you want to stop accepting payments through a particular service and mark it as deleted.

1. Open the service page navigating in the Dashboard application.
Click **Services**, then click on the service which you want to archive.
2. Click **Delete Service**
3. Your wallet will prompt you to confirm the operation, interaction with the service contract.
    
    :::info
    
    Archiving a service is a blockchain operation that why it requires some Tezos tokens to be completed.
    
    :::info
    
    Once you confirm, you’ll launch archiving the service.

4. Wait while the service will be archived. On average, it takes a couple of minutes.

## Restore a service
If you want to restore a deleted service, you need to: 

1. Open the service page navigating in the Dashboard application.
Click **Services**, then click on archived service, which you want to restore.
2. Click **Restore Service**
3. Your wallet will prompt you to confirm the operation, interaction with the service contract.
    
    :::info
    
    Restoring a service is a blockchain operation that why it requires some Tezos tokens to be completed.
    
    :::info

    Once you confirm, you’ll launch restoring the service.

4. Wait while the service is being restored. On average, it takes a couple of minutes.
