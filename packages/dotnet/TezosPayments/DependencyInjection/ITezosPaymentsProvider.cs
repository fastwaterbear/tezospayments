namespace TezosPayments.DependencyInjection;

public interface ITezosPaymentsProvider
{
    ITezosPaymentsClient GetClient(string clientName);
}
