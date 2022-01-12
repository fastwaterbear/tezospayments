using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using TezosPayments.DependencyInjection.Extensions;
using TezosPayments.Models;

namespace TezosPayments.DependencyInjection.Tests;

public class DefaultTezosPaymentsTests
{
    public const string ApiSecretKey = "edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4";
    public const string ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR";

    public IServiceCollection Services { get; private set; } = default!;

    [SetUp]
    public void SetUp()
    {
        Services = new ServiceCollection();
    }

    [TearDown]
    public void TearDown()
    {
        Services.Clear();
    }

    [Test]
    public void AddDefaultTezosPayments()
    {
        // Arrange
        var tezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress
        };
        // Act
        Services.AddTezosPayments(tezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPayments1 = scope.ServiceProvider.GetRequiredService<ITezosPayments>();
        var tezosPayments2 = scope.ServiceProvider.GetRequiredService<ITezosPayments>();
        var tezosPayments = scope.ServiceProvider.GetServices<ITezosPayments>();
        // Assert
        Assert.That(tezosPayments1, Is.Not.Null.And.SameAs(tezosPayments2));
        Assert.That(tezosPayments, Is.EquivalentTo(new List<ITezosPayments>() { tezosPayments1 }));
        Assert.That(tezosPayments1.ServiceContractAddress, Is.EqualTo(tezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments1.Network, Is.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void AddDefaultTezosPayments_WithOptionalOptions()
    {
        // Arrange
        var tezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress,
            Network = new() { Name = "hangzhounet" },
            DefaultPaymentUrlType = Models.PaymentUrlType.Base64
        };
        // Act
        Services.AddTezosPayments(tezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPayments1 = scope.ServiceProvider.GetRequiredService<ITezosPayments>();
        var tezosPayments2 = scope.ServiceProvider.GetRequiredService<ITezosPayments>();
        var tezosPayments = scope.ServiceProvider.GetServices<ITezosPayments>();
        // Assert
        Assert.That(tezosPayments1, Is.Not.Null.And.SameAs(tezosPayments2));
        Assert.That(tezosPayments, Is.EquivalentTo(new List<ITezosPayments>() { tezosPayments1 }));
        Assert.That(tezosPayments1.ServiceContractAddress, Is.EqualTo(tezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments1.Network, Is.EqualTo(Network.Hangzhounet));
    }

    [Test]
    public void AddDefaultTezosPaymentsToSeparatedScopes_ExpectDifferentInstances()
    {
        // Arrange
        var tezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress
        };
        // Act
        Services.AddTezosPayments(tezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        var tezosPayments = new List<ITezosPayments>();
        for (int i = 0; i < 3; i++)
        {
            using var scope = provider.CreateScope();
            tezosPayments.Add(scope.ServiceProvider.GetRequiredService<ITezosPayments>());
        }
        // Assert
        Assert.That(tezosPayments, Is.All.Not.Null);
        Assert.That(tezosPayments, Is.Unique);
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.SameAs(tezosPaymentsOptions.ServiceContractAddress));
    }

    [Test]
    public void AddDefaultTezosPaymentsToSeparatedScopes_WithTransientLifetime_ExpectDifferentInstances()
    {
        // Arrange
        var tezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress
        };
        // Act
        Services.AddTezosPayments(tezosPaymentsOptions, ServiceLifetime.Transient);
        var provider = Services.BuildServiceProvider();

        var tezosPayments = new List<ITezosPayments>();
        using var scope = provider.CreateScope();

        for (int i = 0; i < 3; i++)
            tezosPayments.Add(scope.ServiceProvider.GetRequiredService<ITezosPayments>());
        // Assert
        Assert.That(tezosPayments, Is.All.Not.Null);
        Assert.That(tezosPayments, Is.Unique);
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.SameAs(tezosPaymentsOptions.ServiceContractAddress));
    }

    [Test]
    public void AddDefaultTezosPaymentsToSeparatedScopes_WithSingletonLifetime_ExpectTheSameInstance()
    {
        // Arrange
        var tezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress
        };
        // Act
        Services.AddTezosPayments(tezosPaymentsOptions, ServiceLifetime.Singleton);
        var provider = Services.BuildServiceProvider();

        var tezosPayments = new List<ITezosPayments>();
        for (int i = 0; i < 3; i++)
        {
            using var scope = provider.CreateScope();
            tezosPayments.Add(scope.ServiceProvider.GetRequiredService<ITezosPayments>());
        }
        // Assert
        Assert.That(tezosPayments, Is.All.Not.Null);
        Assert.That(tezosPayments, Is.All.SameAs(tezosPayments[0]));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.SameAs(tezosPaymentsOptions.ServiceContractAddress));
    }
};
