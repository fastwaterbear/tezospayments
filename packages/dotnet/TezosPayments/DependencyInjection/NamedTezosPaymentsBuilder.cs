using Microsoft.Extensions.DependencyInjection;

namespace TezosPayments.DependencyInjection;

public class NamedTezosPaymentsBuilder : TezosPaymentsBuilder, INamedTezosPaymentsBuilder
{
    public string Name { get; }

    public NamedTezosPaymentsBuilder(IServiceCollection services, ServiceLifetime serviceLifetime, string name)
        : base(services, serviceLifetime)
    {
        Name = GuardUtils.EnsureStringArgumentIsValid(name, nameof(name));
    }
}
