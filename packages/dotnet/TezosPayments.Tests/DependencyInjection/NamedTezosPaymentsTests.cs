using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using NUnit.Framework.Constraints;
using TezosPayments.DependencyInjection.Extensions;
using TezosPayments.Models;

namespace TezosPayments.DependencyInjection.Tests;

public class NamedTezosPaymentsTests
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
    public void GetNamedTezosPayments()
    {
        // Arrange
        const string name = "tezosPayments";
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(name, TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();

        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < requestCount; i++)
            tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(name));

        var expectedTezosPayments = scope.ServiceProvider.GetServices<NamedTezosPaymentsServiceContainer<ITezosPayments>>()
           .Select(container => container.ServiceInstance);
        // Assert
        Assert.That(tezosPayments, Is.EquivalentTo(expectedTezosPayments).And.Count.EqualTo(1));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetSeveralNamedTezosPayments()
    {
        // Arrange
        const int requestCount = 3;
        var names = new List<string>() { "onlineShopA", "onlineShopB", "marketplace" };
        // Act
        foreach (var name in names)
            Services.AddTezosPayments(name, TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();

        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < names.Count; i++)
        {
            for (int j = 0; j < requestCount; j++)
                tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(names[i]));
        }

        var expectedTezosPayments = scope.ServiceProvider.GetServices<NamedTezosPaymentsServiceContainer<ITezosPayments>>()
            .Select(container => container.ServiceInstance);
        // Assert
        Assert.That(tezosPayments, Is.Unique.And.EquivalentTo(expectedTezosPayments).And.Count.EqualTo(names.Count));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetNamedTezosPaymentsInDifferentScopes_WithSameName_ExpectDifferentInstances()
    {
        // Arrange
        const string name = "tezosPayments";
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(name, TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < requestCount; i++)
        {
            using var scope = provider.CreateScope();
            var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();
            tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(name));
        }
        // Assert
        Assert.That(tezosPayments, Has.Count.EqualTo(requestCount));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetNamedTezosPaymentsInDifferentScopes_WithSameNameAndTransientLifetime_ExpectDifferentInstances()
    {
        // Arrange
        const string name = "tezosPayments";
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(name, TezosPaymentsOptions, ServiceLifetime.Transient);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < requestCount; i++)
        {
            var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();
            tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(name));
        }
        // Assert
        Assert.That(tezosPayments, Has.Count.EqualTo(requestCount));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetNamedTezosPaymentsInDifferentScopes_WithSameNameAndSingletonLifetime_ExpectSameInstance()
    {
        // Arrange
        const string name = "tezosPayments";
        const int requestCount = 3;
        // Act
        Services.AddTezosPayments(name, TezosPaymentsOptions, ServiceLifetime.Singleton);
        var provider = Services.BuildServiceProvider();

        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < requestCount; i++)
        {
            using var scope = provider.CreateScope();
            var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();
            tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(name));
        }

        var expectedTezosPayments = provider.GetServices<NamedTezosPaymentsServiceContainer<ITezosPayments>>()
            .Select(container => container.ServiceInstance);
        // Assert
        Assert.That(tezosPayments, Is.EquivalentTo(expectedTezosPayments).And.Count.EqualTo(1));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetDefaultTezosPayments_ExpectIsNull()
    {
        // Arrange
        var names = new List<string>() { "onlineShopA", "onlineShopB", "marketplace" };
        var tezosPaymentsOptions = new TezosPaymentsOptions
        {
            ApiSecretKey = ApiSecretKey,
            ServiceContractAddress = ServiceContractAddress
        };
        // Act
        foreach (var name in names)
            Services.AddTezosPayments(name, tezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var defaultTezosPayments = scope.ServiceProvider.GetService<ITezosPayments>();
        // Assert
        Assert.That(defaultTezosPayments, Is.Null);
    }
    [Test]
    public void GetDefaultAndNamedTezosPayments_ExpectDifferentInstances()
    {
        // Arrange
        const int requestCount = 3;
        var names = new List<string>() { "onlineShopA", "onlineShopB", "marketplace" };
        // Act
        Services.AddTezosPayments(TezosPaymentsOptions);
        foreach (var name in names)
            Services.AddTezosPayments(name, TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();

        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < names.Count; i++)
        {
            for (int j = 0; j < requestCount; j++)
            {
                tezosPayments.Add(scope.ServiceProvider.GetRequiredService<ITezosPayments>());
                tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(names[i]));
            }
        }

        var expectedTezosPayments = scope.ServiceProvider.GetServices<ITezosPayments>()
            .Concat(scope.ServiceProvider.GetServices<NamedTezosPaymentsServiceContainer<ITezosPayments>>()
                .Select(container => container.ServiceInstance)
            );
        // Assert
        Assert.That(tezosPayments, Is.Unique.And.EquivalentTo(expectedTezosPayments).And.Count.EqualTo(names.Count + 1));
        Assert.That(tezosPayments.Select(tp => tp.ServiceContractAddress), Is.All.EqualTo(TezosPaymentsOptions.ServiceContractAddress));
        Assert.That(tezosPayments.Select(tp => tp.Network), Is.All.EqualTo(Constants.DefaultNetwork));
    }

    [Test]
    public void GetTezosPaymentsProvider_ExpectTheSameForAllNamedInstances()
    {
        // Arrange
        const int requestCount = 3;
        var names = new List<string>() { "onlineShopA", "onlineShopB", "marketplace" };
        // Act
        foreach (var name in names)
            Services.AddTezosPayments(name, TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsProviders = new HashSet<ITezosPaymentsProvider>();
        for (int i = 0; i < requestCount; i++)
            tezosPaymentsProviders.Add(scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>());

        var expectedServiceProviders = scope.ServiceProvider.GetServices<ITezosPaymentsProvider>();
        // Assert
        Assert.That(tezosPaymentsProviders, Is.EquivalentTo(expectedServiceProviders).And.Count.EqualTo(1));
    }

    [Test]
    public void AddSeveralNamedTezosPayments_WithDifferentOptions()
    {
        // Arrange
        const int requestCount = 3;
        var nameOptionsTuples = new List<(string name, TezosPaymentsOptions options)>() {
            ("onlineShopA", TezosPaymentsOptions),
            ("onlineShopB", new() {
                ApiSecretKey = "spsk2BcApUGCsmNmr44Xn1FMhioWgsLJFMtLdLwBcPWk19274qGoyh",
                ServiceContractAddress = "KT1HTuxrFUAwhpSyJ2kWiFqppvvnhyFuUxZZ"
            }),
            ("marketplace", new() {
                ApiSecretKey = "p2sk3kuqcvvstukxhWrc2QTwVBVuiRMWfZDeDrtPkq8MNHPBbq23c8",
                ServiceContractAddress = "KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh",
                Network = new() { Name = "granadanet" },
                ServiceContractDomain = "marketplace.tez"
            }),
        };
        // Act
        foreach (var (name, options) in nameOptionsTuples)
            Services.AddTezosPayments(name, options);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();

        var tezosPayments = new HashSet<ITezosPayments>();
        for (int i = 0; i < nameOptionsTuples.Count; i++)
        {
            for (int j = 0; j < requestCount; j++)
                tezosPayments.Add(tezosPaymentsProvider.GetTezosPayments(nameOptionsTuples[i].name));
        }

        var expectedTezosPayments = scope.ServiceProvider.GetServices<NamedTezosPaymentsServiceContainer<ITezosPayments>>()
            .Select(container => container.ServiceInstance);
        // Assert
        Assert.That(tezosPayments, Is.Unique.And.EquivalentTo(expectedTezosPayments).And.Count.EqualTo(nameOptionsTuples.Count));
        Assert.That(
            tezosPayments.Select(tp => tp.ServiceContractAddress),
            Is.Unique.And.EquivalentTo(nameOptionsTuples.Select(tuple => tuple.options.ServiceContractAddress))
        );
        Assert.That(
            tezosPayments.Select(tp => tp.Network),
            Is.EquivalentTo(nameOptionsTuples.Select(tuple => tuple.options.Network?.Name != null
                ? Network.CreateOrGetNetwork(tuple.options.Network.Name)
                : Constants.DefaultNetwork
            ))
        );
    }

    [Test]
    public void GetTezosPaymentsByNonExistentName_ThrowsException()
    {
        // Arrange
        const string name = "tezosPayments";
        const string requestedName = "someName";
        // Act
        Services.AddTezosPayments(name, TezosPaymentsOptions);
        var provider = Services.BuildServiceProvider();

        using var scope = provider.CreateScope();
        var tezosPaymentsProvider = scope.ServiceProvider.GetRequiredService<ITezosPaymentsProvider>();

        // Act & Assert
        Assert.That(
            () => tezosPaymentsProvider.GetTezosPayments(requestedName),
            Throws.Exception.With.Message.Contains(requestedName)
        );
    }

    [TestCaseSource(typeof(TezosPaymentsOptionsCases), nameof(TezosPaymentsOptionsCases.InvalidCases))]
    public void AddDefaultTezosPayments_WithInvalidOptions_ThrowsException(
        string caseMessage,
        Func<TezosPaymentsOptions> tezosPaymentsOptionsFactory,
        Func<Constraint> constraintFactory
    )
    {
        // Act & Assert
        Assert.That(
            () => Services.AddTezosPayments("tezosPayments", tezosPaymentsOptionsFactory()),
            constraintFactory(),
            caseMessage
        );
    }
}
