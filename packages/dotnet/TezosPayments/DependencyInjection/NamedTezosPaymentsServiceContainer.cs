namespace TezosPayments.DependencyInjection;

public class NamedTezosPaymentsServiceContainer<T> where T : class
{
    public string TezosPaymentsName { get; }
    public T ServiceInstance { get; }

    public NamedTezosPaymentsServiceContainer(string tezosPaymentsName, T serviceInstance)
    {
        TezosPaymentsName = GuardUtils.EnsureStringArgumentIsValid(tezosPaymentsName, nameof(tezosPaymentsName));
        ServiceInstance = serviceInstance ?? throw new ArgumentNullException(nameof(serviceInstance));
    }
}
