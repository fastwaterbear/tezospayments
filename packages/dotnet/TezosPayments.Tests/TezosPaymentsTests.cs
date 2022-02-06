using System;
using System.Threading.Tasks;
using NUnit.Framework;
using TezosPayments.DependencyInjection;

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
        var tezosPaymentsClient = new TezosPaymentsClient(
            options.ServiceContractAddress,
            options.ApiSecretKey,
            new TezosPaymentsDefaultOptions()
            {
                Network = TezosNetworkOptionsConverter.Convert(options.Network) ?? Constants.DefaultNetwork,
                ServiceContractDomain = options.ServiceContractDomain
            }
        );
        var paymentCreateParameters = paymentCreateParametersFactory();
        var expectedPayment = expectedPaymentFactory();
        // Act
        var payment = await tezosPaymentsClient.CreatePaymentAsync(paymentCreateParameters);
        // Assert
        Assert.That(payment, Is.EqualTo(expectedPayment), caseMessage);
    }
}
