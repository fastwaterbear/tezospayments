using TezosPayments.DependencyInjection.Converters;
using TezosPayments.Options;
using TezosPayments.PaymentUrlFactories;
using TezosPayments.Serialization;
using TezosPayments.Signing.Signers;
using TezosPayments.Signing.SignPayloadEncoding;

namespace TezosPayments.DependencyInjection.Extensions;

public static partial class TezosPaymentsServiceCollectionExtensions
{
    private static TezosPayments CreateTezosPayments(
         IServiceProvider provider,
         ITezosPaymentsBuilder builder,
         TezosPaymentsOptions options
     )
    {
        var defaultOptions = provider.GetRequiredTezosPaymentsService<TezosPaymentDefaultOptions>(builder);
        var defaultPaymentParameters = provider.GetRequiredTezosPaymentsService<DefaultPaymentParameters>(builder);
        var signer = provider.GetRequiredTezosPaymentsService<IPaymentSigner>(builder);
        var urlFactoryProvider = provider.GetRequiredTezosPaymentsService<IPaymentUrlFactoryProvider>(builder);

        return new TezosPayments(
            options.ServiceContractAddress,
            defaultOptions,
            defaultPaymentParameters,
            signer,
            urlFactoryProvider
        );
    }

    private static TezosPaymentDefaultOptions CreateTezosPaymentDefaultOptions(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        var tezosNetworkOptionsConverter = provider.GetRequiredTezosPaymentsService<ITezosNetworkOptionsConverter>(builder);
        var network = tezosNetworkOptionsConverter.Convert(options.Network);

        var defaultOptions = new TezosPaymentDefaultOptions()
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
        var paymentSerializer = provider.GetRequiredTezosPaymentsService<IBase64PaymentSerializer>(builder);

        return new Base64PaymentUrlFactory(paymentSerializer);
    }

    private static Base64PaymentSerializer CreateBase64PaymentSerializer(
        IServiceProvider provider,
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        return new Base64PaymentSerializer();
    }
}
