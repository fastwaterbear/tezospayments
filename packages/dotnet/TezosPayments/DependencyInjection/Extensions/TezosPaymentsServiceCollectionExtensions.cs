using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TezosPayments.DependencyInjection.Converters;
using TezosPayments.PaymentUrlFactories;
using TezosPayments.Serialization;
using TezosPayments.Signing.Signers;
using TezosPayments.Signing.SignPayloadEncoding;
using TezosPayments.Validation;

namespace TezosPayments.DependencyInjection.Extensions;

public static partial class TezosPaymentsServiceCollectionExtensions
{
    public static ITezosPaymentsBuilder AddTezosPayments(
        this IServiceCollection services,
        TezosPaymentsOptions options,
        ServiceLifetime serviceLifetime = ServiceLifetime.Scoped
    )
    {
        if (services == null)
            throw new ArgumentNullException(nameof(services));
        if (options == null)
            throw new ArgumentNullException(nameof(options));

        options.Validate();

        var builder = new TezosPaymentsBuilder(services, serviceLifetime);

        AddSystemDependencies(builder, options);
        AddTezosPaymentsAndDependencies(builder, options);

        return builder;
    }

    private static void AddSystemDependencies(
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions _
    )
    {
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(ITezosNetworkOptionsConverter),
            typeof(TezosNetworkOptionsConverter),
            builder.ServiceLifetime
        ));
    }

    private static void AddTezosPaymentsAndDependencies(
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(ITezosPaymentsClient),
            provider => CreateTezosPaymentsClient(provider, builder, options),
            builder.ServiceLifetime
        ));

        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(TezosPaymentsDefaultOptions),
            provider => CreateTezosPaymentDefaultOptions(provider, builder, options),
            builder.ServiceLifetime
        ));
        builder.Services.TryAdd(new ServiceDescriptor(
           typeof(DefaultPaymentParameters),
           provider => CreateDefaultPaymentParameters(provider, builder, options),
           builder.ServiceLifetime
        ));

        builder.Services.TryAdd(new ServiceDescriptor(
             typeof(IPaymentSigner),
             provider => CreateApiSecretKeyPaymentSigner(provider, builder, options),
             builder.ServiceLifetime
        ));
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(IPaymentUrlFactoryProvider),
            provider => CreateProxyPaymentUrlFactoryProvider(provider, builder, options),
            builder.ServiceLifetime
        ));
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(IPaymentValidator),
            provider => CreatePaymentValidator(provider, builder, options),
            builder.ServiceLifetime
        ));

        AddNestedTezosPaymentsDependencies(builder, options);
    }

    private static void AddNestedTezosPaymentsDependencies(
        ITezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(IPaymentSignPayloadEncoder),
            provider => CreatePaymentSignPayloadEncoder(provider, builder, options),
            builder.ServiceLifetime
        ));
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(IBase64PaymentUrlFactory),
            provider => CreateBase64PaymentUrlFactory(provider, builder, options),
            builder.ServiceLifetime
        ));
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(IBase64JsonPaymentSerializer),
            provider => CreateBase64PaymentSerializer(provider, builder, options),
            builder.ServiceLifetime
        ));
    }
}
