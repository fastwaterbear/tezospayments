using Microsoft.Extensions.DependencyInjection;
using TezosPayments.Signing.Signers;

namespace TezosPayments.DependencyInjection.Extensions;

public static partial class NamedTezosPaymentsBuilderExtensions
{
    public static INamedTezosPaymentsBuilder AddSigner<TSigner>(
        this INamedTezosPaymentsBuilder builder,
        Func<IServiceProvider, TSigner> implementationFactory
    ) where TSigner : class, IPaymentSigner
    {
        builder.Services.Add(new ServiceDescriptor(
            typeof(NamedTezosPaymentsServiceContainer<IPaymentSigner>),
            provider =>
            {
                var serviceInstance = implementationFactory(provider);

                return new NamedTezosPaymentsServiceContainer<IPaymentSigner>(builder.Name, serviceInstance);
            },
            builder.ServiceLifetime
        ));

        return builder;
    }
}
