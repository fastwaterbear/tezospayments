using TezosPayments.DependencyInjection.Extensions;

namespace TezosPayments.DependencyInjection;

public class TezosPaymentsProvider : ITezosPaymentsProvider
{
    public IServiceProvider ServiceProvider { get; }

    public TezosPaymentsProvider(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    public ITezosPayments GetTezosPayments(string name)
    {
        GuardUtils.EnsureStringArgumentIsValid(name, nameof(name));

        return ServiceProvider.GetRequiredTezosPaymentsService<ITezosPayments>(name);
    }
}
