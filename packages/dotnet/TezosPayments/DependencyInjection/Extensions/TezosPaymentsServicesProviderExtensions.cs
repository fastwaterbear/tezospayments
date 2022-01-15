using Microsoft.Extensions.DependencyInjection;

namespace TezosPayments.DependencyInjection.Extensions;

public static class TezosPaymentsServicesProviderExtensions
{
    internal static T GetRequiredTezosPaymentsService<T>(this IServiceProvider provider, ITezosPaymentsBuilder builder)
        where T : class
    {
        if (builder is INamedTezosPaymentsBuilder namedBuilder)
            return GetRequiredTezosPaymentsService<T>(provider, namedBuilder.Name);

        if (provider == null)
            throw new ArgumentNullException(nameof(provider));

        return provider.GetRequiredService<T>();
    }

    public static T GetRequiredTezosPaymentsService<T>(this IServiceProvider provider, string name)
        where T : class
    {
        if (provider == null)
            throw new ArgumentNullException(nameof(provider));

        var service = provider.GetServices<NamedTezosPaymentsServiceContainer<T>>()
            .LastOrDefault(container => container.TezosPaymentsName == name)?.ServiceInstance;

        return service ?? throw new Exception($"An instance of TezosPayments service not found by the name: {name}");
    }
}
