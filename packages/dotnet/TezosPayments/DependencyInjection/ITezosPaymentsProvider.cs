namespace TezosPayments.DependencyInjection;

public interface ITezosPaymentsProvider
{
    ITezosPayments GetTezosPayments(string name);
}
