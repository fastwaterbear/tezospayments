using Microsoft.Extensions.DependencyInjection;

namespace TezosPayments.DependencyInjection.Extensions;

public static class TezosPaymentsServicesProviderExtensions
{
    internal static T GetRequiredTezosPaymentsService<T>(this IServiceProvider provider, ITezosPaymentsBuilder builder)
        where T : class
    {
        if (provider == null)
            throw new ArgumentNullException(nameof(provider));

        return provider.GetRequiredService<T>();
    }
}
