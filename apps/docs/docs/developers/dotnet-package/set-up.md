---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set up
The Tezos Payments .NET package supports .NET 6 or later. Make sure that you have the supported version:
```bash
dotnet --version
```

## Install the Tezos Payments .NET package
Add the package to your project:

<Tabs>
<TabItem value="dotnet-cli" label=".NET CLI">

```bash
dotnet add package TezosPayments
```

</TabItem>

<TabItem value="package-manager" label="Package Manager">

```powershell
Install-Package TezosPayments
```

</TabItem>
</Tabs>

## Set up the Tezos Payments Client
Tezos Payments Client (`TezosPaymentsClient`) is a class with which you’ll create payment links. One instance is used for one service.

### Set up the client in ASP.NET application
In *Program.cs* of your project, register the `TezosPaymentsClient` through the `AddTezosPayments` extension method, as shown in the following example:

```cs
using TezosPayments.DependencyInjection.Extensions;

// ...

builder.Services.AddTezosPayments(new()
{
    ServiceContractAddress = "<contract address of your service>",
    ApiSecretKey = "<API secret key of this service>"
});
```

The default client will be registered. To access it in controllers, you need to add the ITezosPaymentsClient interface to the controller constructor as a parameter:

```cs
using TezosPayments;

// ...

public class SomeController : ControllerBase
{
    private ITezosPaymentsClient TezosPaymentsClient { get; }

    public SomeController(ITezosPaymentsClient tezosPaymentsClient)
    {
        TezosPaymentsClient = tezosPaymentsClient ?? throw new ArgumentNullException(nameof(tezosPaymentsClient));
    }
}
```

If your application works with multiple services or multiple API keys you need to register named clients:

```cs
using TezosPayments.DependencyInjection.Extensions;

// ...

builder.Services.AddTezosPayments("client1", new TezosPaymentsOptions()
{
    ServiceContractAddress = "<contract address of your service 1>",
    ApiSecretKey = "<API secret key of this service 1>"
});
builder.Services.AddTezosPayments("client2", new TezosPaymentsOptions()
{
    ServiceContractAddress = "<contract address of your service 2>",
    ApiSecretKey = "<API secret key of this service 2>"
});
builder.Services.AddTezosPayments("client3", new TezosPaymentsOptions()
{
    ServiceContractAddress = "<contract address of your service 3>",
    ApiSecretKey = "<API secret key of this service 3>"
});
```

Then you may access these clients using the `ITezosPaymentsProvider` interface:

```cs
using TezosPayments;
using TezosPayments.DependencyInjection;

// ...

public class SomeController : ControllerBase
{
    private ITezosPaymentsClient TezosPaymentsClient1 { get; }
    private ITezosPaymentsClient TezosPaymentsClient2 { get; }
    private ITezosPaymentsClient TezosPaymentsClient3 { get; }

    public SomeController(ITezosPaymentsProvider provider)
    {
        TezosPaymentsClient1 = provider.GetClient("client1");
        TezosPaymentsClient2 = provider.GetClient("client2");
        TezosPaymentsClient3 = provider.GetClient("client3");
    }
}
```

### Set up the client in .NET application or library
In projects without DI you need to create an instance of `TezosPaymentsClient` manually:

```cs
using TezosPayments;

// ...

var tezosPaymentsClient = new TezosPaymentsClient(
    serviceContractAddress: "<contract address of your service>",
    apiSecretKey: "<API secret key of this service>"
);
```

If you need to specify a network use the `TezosPaymentsDefaultOptions` class:

```cs
var tezosPaymentsClient = new TezosPaymentsClient(
    serviceContractAddress: "<contract address of your service>",
    apiSecretKey: "<API secret key of this service>"
    new TezosPaymentsDefaultOptions()
    {
        Network = Network.Hangzhounet
    }
);
```
