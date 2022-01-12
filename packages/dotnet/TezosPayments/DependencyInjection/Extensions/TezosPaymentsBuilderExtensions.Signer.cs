using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TezosPayments.Signing.Signers;

namespace TezosPayments.DependencyInjection.Extensions;

public static partial class TezosPaymentsBuilderExtensions
{
    public static ITezosPaymentsBuilder AddSigner<TSigner>(
        this ITezosPaymentsBuilder builder
    ) where TSigner : class, IPaymentSigner
    {
        builder.Services.Replace(new ServiceDescriptor(
            typeof(IPaymentSigner),
            typeof(TSigner),
            builder.ServiceLifetime
        ));

        return builder;
    }

    public static ITezosPaymentsBuilder AddSigner<TSigner>(
        this ITezosPaymentsBuilder builder,
        Func<IServiceProvider, TSigner> implementationFactory
    ) where TSigner : class, IPaymentSigner
    {
        builder.Services.Replace(new ServiceDescriptor(
            typeof(IPaymentSigner),
            implementationFactory,
            builder.ServiceLifetime
        ));

        return builder;
    }
}
