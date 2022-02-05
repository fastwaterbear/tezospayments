using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using NUnit.Framework.Constraints;
using TezosPayments.DependencyInjection.Extensions;
using TezosPayments.Models;

namespace TezosPayments.DependencyInjection.Tests;

public class DefaultTezosPaymentsTests
{
    public const string ApiSecretKey = "edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4";
    public const string ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR";

    public IServiceCollection Services { get; private set; } = default!;
    public TezosPaymentsOptions TezosPaymentsOptions { get; private set; } = default!;

    [SetUp]
    public void SetUp()
    {
        Services = new ServiceCollection();
        TezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress
        };
    }

    [TearDown]
    public void TearDown()
    {
        Services.Clear();
    }

    [Test]
    public void GetDefaultTezosPayments()
    {
        // Arrange
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsClients = new HashSet<ITezosPaymentsClient>();
        for (int i = 0; i < requestCount; i++)
            tezosPaymentsClients.Add(scope.ServiceProvider.GetRequiredService<ITezosPaymentsClient>());

        var expectedTezosPaymentsClients = scope.ServiceProvider.GetServices<ITezosPaymentsClient>();
        // Assert
        Assert.That(tezosPaymentsClients, Is.EquivalentTo(expectedTezosPaymentsClients).And.Count.EqualTo(1));
        Assert.That(tezosPaymentsClients.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPaymentsClients.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetDefaultTezosPaymentsInDifferentScopes_ExpectDifferentInstances()
    {
        // Arrange
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        var tezosPaymentsClients = new HashSet<ITezosPaymentsClient>();
        for (int i = 0; i < requestCount; i++)
        {
            using var scope = provider.CreateScope();
            tezosPaymentsClients.Add(scope.ServiceProvider.GetRequiredService<ITezosPaymentsClient>());
        }
        // Assert
        Assert.That(tezosPaymentsClients, Has.Count.EqualTo(requestCount));
        Assert.That(tezosPaymentsClients.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPaymentsClients.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetDefaultTezosPaymentsInDifferentScopes_WithTransientLifetime_ExpectDifferentInstances()
    {
        // Arrange
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(TezosPaymentsOptions, ServiceLifetime.Transient);
        var provider = Services.BuildServiceProvider();

        var tezosPaymentsClients = new List<ITezosPaymentsClient>();
        using var scope = provider.CreateScope();

        for (int i = 0; i < requestCount; i++)
            tezosPaymentsClients.Add(scope.ServiceProvider.GetRequiredService<ITezosPaymentsClient>());
        // Assert
        Assert.That(tezosPaymentsClients, Has.Count.EqualTo(requestCount));
        Assert.That(tezosPaymentsClients.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPaymentsClients.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetDefaultTezosPaymentsInDifferentScopes_WithSingletonLifetime_ExpectSameInstance()
    {
        // Arrange
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(TezosPaymentsOptions, ServiceLifetime.Singleton);
        var provider = Services.BuildServiceProvider();

        var tezosPaymentsClients = new HashSet<ITezosPaymentsClient>();
        for (int i = 0; i < requestCount; i++)
        {
            using var scope = provider.CreateScope();
            tezosPaymentsClients.Add(scope.ServiceProvider.GetRequiredService<ITezosPaymentsClient>());
        }

        var expectedTezosPaymentsClients = provider.GetServices<ITezosPaymentsClient>();
        // Assert
        Assert.That(tezosPaymentsClients, Is.EquivalentTo(expectedTezosPaymentsClients).And.Count.EqualTo(1));
        Assert.That(tezosPaymentsClients.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPaymentsClients.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void AddDefaultTezosPayments_WithOptionalOptions()
    {
        // Arrange
        const int requestCount = 3;
        var tezosPaymentsOptions = TezosPaymentsOptions with
        {
            Network = new() { Name = "hangzhounet" },
            DefaultPaymentUrlType = PaymentUrlType.Base64
        };
        // Act
        Services.AddTezosPayments(tezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsClients = new HashSet<ITezosPaymentsClient>();
        for (int i = 0; i < requestCount; i++)
            tezosPaymentsClients.Add(scope.ServiceProvider.GetRequiredService<ITezosPaymentsClient>());

        var expectedTezosPaymentsClients = scope.ServiceProvider.GetServices<ITezosPaymentsClient>();
        // Assert
        Assert.That(tezosPaymentsClients, Is.EquivalentTo(expectedTezosPaymentsClients).And.Count.EqualTo(1));
        Assert.That(tezosPaymentsClients.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(tezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPaymentsClients.Select(tp => tp.Network), Is.All.EqualTo(Network.Hangzhounet));
    }

    [TestCaseSource(typeof(TezosPaymentsOptionsCases), nameof(TezosPaymentsOptionsCases.InvalidCases))]
    public void AddDefaultTezosPayments_WithInvalidOptions_ThrowsException(
        string caseMessage,
        Func<TezosPaymentsOptions> tezosPaymentsOptionsFactory,
        Func<Constraint> constraintFactory
    )
    {
        // Act & Assert
        Assert.That(() => Services.AddTezosPayments(tezosPaymentsOptionsFactory()), constraintFactory(), caseMessage);
    }
};
