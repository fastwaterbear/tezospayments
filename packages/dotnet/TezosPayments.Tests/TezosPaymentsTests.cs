using System;
using System.Threading.Tasks;
using NUnit.Framework;
using TezosPayments.DependencyInjection;
using TezosPayments.Models;

namespace TezosPayments.Tests;

public class TezosPaymentsTests
{
    private readonly static DependencyInjection.Converters.TezosNetworkOptionsConverter TezosNetworkOptionsConverter = new();

    [TestCaseSource(typeof(PaymentTestCases), nameof(PaymentTestCases.ValidCases))]
    public async Task CreatePayment_WithValidParameters(
        string caseMessage,
        Func<TezosPaymentsOptions> tezosPaymentsOptionsFactory,
        Func<PaymentCreateParameters> paymentCreateParametersFactory,
        Func<IPayment> expectedPaymentFactory
    )
    {
        // Arrange
        var options = tezosPaymentsOptionsFactory();
        var tezosPayments = new TezosPayments(
            options.ServiceContractAddress,
            options.ApiSecretKey,
            new TezosPaymentDefaultOptions()
            {
                Network = TezosNetworkOptionsConverter.Convert(options.Network) ?? Constants.DefaultNetwork,
                ServiceContractDomain = options.ServiceContractDomain
            }
        );
        var paymentCreateParameters = paymentCreateParametersFactory();
        var expectedPayment = expectedPaymentFactory();
        // Act
        var payment = await tezosPayments.CreatePaymentAsync(paymentCreateParameters);
        // Assert
        Assert.That(payment, Is.EqualTo(expectedPayment), caseMessage);
    }
}
