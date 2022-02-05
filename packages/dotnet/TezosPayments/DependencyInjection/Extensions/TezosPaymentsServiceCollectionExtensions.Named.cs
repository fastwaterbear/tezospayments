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
    public static INamedTezosPaymentsBuilder AddTezosPayments(
        this IServiceCollection services,
        string name,
        TezosPaymentsOptions options,
        ServiceLifetime serviceLifetime = ServiceLifetime.Scoped
    )
    {
        if (services == null)
            throw new ArgumentNullException(nameof(services));
        if (options == null)
            throw new ArgumentNullException(nameof(options));

        options.Validate();

        var builder = new NamedTezosPaymentsBuilder(services, serviceLifetime, name);

        AddSystemDependencies(builder, options);
        AddTezosPaymentsAndDependencies(builder, options);

        return builder;
    }

    private static void AddSystemDependencies(
        INamedTezosPaymentsBuilder builder,
        TezosPaymentsOptions _
    )
    {
        builder.Services.TryAdd(new ServiceDescriptor(
            typeof(ITezosPaymentsProvider),
            typeof(TezosPaymentsProvider),
            builder.ServiceLifetime
        ));

        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<ITezosNetworkOptionsConverter>),
            provider => WrapInContainer<ITezosNetworkOptionsConverter>(new TezosNetworkOptionsConverter(), builder),
            builder.ServiceLifetime
        ));
    }

    private static void AddTezosPaymentsAndDependencies(
        INamedTezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<ITezosPayments>),
            provider => WrapInContainer<ITezosPayments>(CreateTezosPayments(provider, builder, options), builder),
            builder.ServiceLifetime
        ));

        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<TezosPaymentDefaultOptions>),
            provider => WrapInContainer(CreateTezosPaymentDefaultOptions(provider, builder, options), builder),
            builder.ServiceLifetime
        ));
        builder.Services.Add(new ServiceDescriptor(
           typeof(NamedTezosPaymentsServiceContainer<DefaultPaymentParameters>),
           provider => WrapInContainer(CreateDefaultPaymentParameters(provider, builder, options), builder),
           builder.ServiceLifetime
        ));

        builder.Services.Add(new ServiceDescriptor(
             typeof(NamedTezosPaymentsServiceContainer<IPaymentSigner>),
             provider => WrapInContainer<IPaymentSigner>(CreateApiSecretKeyPaymentSigner(provider, builder, options), builder),
             builder.ServiceLifetime
        ));
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<IPaymentUrlFactoryProvider>),
            provider => WrapInContainer<IPaymentUrlFactoryProvider>(CreateProxyPaymentUrlFactoryProvider(provider, builder, options), builder),
            builder.ServiceLifetime
        ));
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<IPaymentValidator>),
            provider => WrapInContainer<IPaymentValidator>(CreatePaymentValidator(provider, builder, options), builder),
            builder.ServiceLifetime
        ));

        AddNestedTezosPaymentsDependencies(builder, options);
    }

    private static void AddNestedTezosPaymentsDependencies(
        INamedTezosPaymentsBuilder builder,
        TezosPaymentsOptions options
    )
    {
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<IPaymentSignPayloadEncoder>),
            provider => WrapInContainer<IPaymentSignPayloadEncoder>(CreatePaymentSignPayloadEncoder(provider, builder, options), builder),
            builder.ServiceLifetime
        ));
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<IBase64PaymentUrlFactory>),
            provider => WrapInContainer<IBase64PaymentUrlFactory>(CreateBase64PaymentUrlFactory(provider, builder, options), builder),
            builder.ServiceLifetime
        ));
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<IBase64JsonPaymentSerializer>),
            provider => WrapInContainer<IBase64JsonPaymentSerializer>(CreateBase64PaymentSerializer(provider, builder, options), builder),
            builder.ServiceLifetime
        ));
    }

    private static NamedTezosPaymentsServiceContainer<T> WrapInContainer<T>(T service, INamedTezosPaymentsBuilder builder)
        where T : class
    {
        return new(builder.Name, service);
    }
}
