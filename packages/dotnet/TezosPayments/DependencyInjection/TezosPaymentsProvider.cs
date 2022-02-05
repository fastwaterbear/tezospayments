using TezosPayments.DependencyInjection.Extensions;

namespace TezosPayments.DependencyInjection;

public class TezosPaymentsProvider : ITezosPaymentsProvider
{
    public IServiceProvider ServiceProvider { get; }

    public TezosPaymentsProvider(IServiceProvider serviceProvider)
    {
        ServiceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    public ITezosPaymentsClient GetClient(string clientName)
    {
        GuardUtils.EnsureStringArgumentIsValid(clientName, nameof(clientName));

        return ServiceProvider.GetRequiredTezosPaymentsService<ITezosPaymentsClient>(clientName);
    }
}
