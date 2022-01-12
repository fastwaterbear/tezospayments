using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TezosPayments.Options;
using TezosPayments.PaymentUrlFactories;
using TezosPayments.Serialization;
using TezosPayments.Signing.Signers;
using TezosPayments.Signing.SignPayloadEncoding;

namespace TezosPayments.DependencyInjection.Extensions;

public static partial class TezosPaymentsServiceCollectionExtensions
{
    public static ITezosPaymentsBuilder AddTezosPayments(
        this IServiceCollection services,
        TezosPaymentsOptions options,
        ServiceLifetime serviceLifetime = ServiceLifetime.Scoped
    )
    {
        options.Validate();

        var builder = new TezosPaymentsBuilder(services, serviceLifetime);

        services.TryAdd(new ServiceDescriptor(
            typeof(ITezosPayments),
            provider =>
            {
                var defaultOptions = provider.GetRequiredService<TezosPaymentDefaultOptions>();
                var defaultPaymentParameters = provider.GetRequiredService<DefaultPaymentParameters>();
                var signer = provider.GetRequiredService<IPaymentSigner>();
                var urlFactoryProvider = provider.GetRequiredService<IPaymentUrlFactoryProvider>();

                var tezosPayments = new TezosPayments(
                    options.ServiceContractAddress,
                    defaultOptions,
                    defaultPaymentParameters,
                    signer,
                    urlFactoryProvider
                );

                return tezosPayments;
            },
            builder.ServiceLifetime
        ));

        services.TryAdd(new ServiceDescriptor(
            typeof(TezosPaymentDefaultOptions),
            _ =>
            {
                var defaultOptions = new TezosPaymentDefaultOptions()
                {
                    ServiceContractDomain = options.ServiceContractDomain
                };
                if (options.Network != null)
                    defaultOptions.Network = options.Network.Value;

                return defaultOptions;
            },
            builder.ServiceLifetime
        ));
        services.TryAdd(new ServiceDescriptor(
           typeof(DefaultPaymentParameters),
           _ =>
           {
               var defaultPaymentParameters = new DefaultPaymentParameters();
               if (options.DefaultPaymentUrlType != null)
                   defaultPaymentParameters.UrlType = options.DefaultPaymentUrlType.Value;

               return defaultPaymentParameters;
           },
           builder.ServiceLifetime
       ));
        services.TryAdd(new ServiceDescriptor(
            typeof(IPaymentSigner),
            provider => new ApiSecretKeyPaymentSigner(
                options.ApiSecretKey,
                provider.GetRequiredService<IPaymentSignPayloadEncoder>()
            ),
            builder.ServiceLifetime
        ));
        services.TryAdd(new ServiceDescriptor(typeof(IPaymentUrlFactoryProvider), typeof(ProxyPaymentUrlFactoryProvider), builder.ServiceLifetime));
        
        services.TryAdd(new ServiceDescriptor(typeof(IPaymentSignPayloadEncoder), typeof(PaymentSignPayloadEncoder), builder.ServiceLifetime));
        services.TryAdd(new ServiceDescriptor(typeof(IBase64PaymentUrlFactory), typeof(Base64PaymentUrlFactory), builder.ServiceLifetime));
        services.TryAdd(new ServiceDescriptor(typeof(IBase64PaymentSerializer), typeof(Base64PaymentSerializer), builder.ServiceLifetime));

        return builder;
    }
}
