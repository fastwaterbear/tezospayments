using Microsoft.Extensions.DependencyInjection;

namespace TezosPayments.DependencyInjection;

public class TezosPaymentsBuilder : ITezosPaymentsBuilder
{
    public IServiceCollection Services { get; }
    public ServiceLifetime ServiceLifetime { get; }

    public TezosPaymentsBuilder(IServiceCollection services, ServiceLifetime serviceLifetime)
    {
        Services = services ?? throw new ArgumentNullException(nameof(services));
        ServiceLifetime = serviceLifetime;
    }
}
