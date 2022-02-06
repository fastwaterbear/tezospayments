using TezosPayments.DependencyInjection.Converters;
using TezosPayments.PaymentUrlFactories;
using TezosPayments.Serialization;
using TezosPayments.Signing.Signers;
using TezosPayments.Signing.SignPayloadEncoding;
using TezosPayments.Validation;

namespace TezosPayments.DependencyInjection.Extensions;

public static partial class TezosPaymentsServiceCollectionExtensions
{
    private static TezosPaymentsClient CreateTezosPaymentsClient(
         IServiceProvider provider,
         ITezosPaymentsBuilder builder,
         TezosPaymentsOptions options
     )
    {
        var defaultOptions = provider.GetRequiredTezosPaymentsService<TezosPaymentsDefaultOptions>(builder);
        var defaultPaymentParameters = provider.GetRequiredTezosPaymentsService<DefaultPaymentParameters>(builder);
        var signer = provider.GetRequiredTezosPaymentsService<IPaymentSigner>(builder);
        var urlFactoryProvider = provider.GetRequiredTezosPaymentsService<IPaymentUrlFactoryProvider>(builder);
        var paymentValidator = provider.GetRequiredTezosPaymentsService<IPaymentValidator>(builder);

        return new TezosPaymentsClient(
            options.ServiceContractAddress,
            defaultOptions,
            defaultPaymentParameters,
            signer,
            urlFactoryProvider,
            paymentValidator
        );
    }

    private static TezosPaymentsDefaultOptions CreateTezosPaymentDefaultOptions(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        var tezosNetworkOptionsConverter = provider.GetRequiredTezosPaymentsService<ITezosNetworkOptionsConverter>(builder);
        var network = tezosNetworkOptionsConverter.Convert(options.Network);

        var defaultOptions = new TezosPaymentsDefaultOptions()
        {
            ServiceContractDomain = options.ServiceContractDomain
        };
        if (network != null)
            defaultOptions.Network = network.Value;

        return defaultOptions;
    }

    private static DefaultPaymentParameters CreateDefaultPaymentParameters(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        var defaultPaymentParameters = new DefaultPaymentParameters();
        if (options.DefaultPaymentUrlType != null)
            defaultPaymentParameters.UrlType = options.DefaultPaymentUrlType.Value;

        return defaultPaymentParameters;
    }

    private static ApiSecretKeyPaymentSigner CreateApiSecretKeyPaymentSigner(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        var paymentSignPayloadEncoder = provider.GetRequiredTezosPaymentsService<IPaymentSignPayloadEncoder>(builder);

        return new ApiSecretKeyPaymentSigner(
            options.ApiSecretKey,
            paymentSignPayloadEncoder
        );
    }

    private static ProxyPaymentUrlFactoryProvider CreateProxyPaymentUrlFactoryProvider(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        var base64PaymentUrlFactory = provider.GetRequiredTezosPaymentsService<IBase64PaymentUrlFactory>(builder);

        return new ProxyPaymentUrlFactoryProvider(base64PaymentUrlFactory);
    }

    private static PaymentValidator CreatePaymentValidator(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        return new PaymentValidator();
    }

    private static PaymentSignPayloadEncoder CreatePaymentSignPayloadEncoder(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        return new PaymentSignPayloadEncoder();
    }

    private static Base64PaymentUrlFactory CreateBase64PaymentUrlFactory(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        var paymentSerializer = provider.GetRequiredTezosPaymentsService<IBase64JsonPaymentSerializer>(builder);

        return new Base64PaymentUrlFactory(paymentSerializer);
    }

    private static Base64JsonPaymentSerializer CreateBase64PaymentSerializer(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        return new Base64JsonPaymentSerializer();
    }
}
