namespace TezosPayments.DependencyInjection;

public interface INamedTezosPaymentsBuilder : ITezosPaymentsBuilder
{
    string Name { get; }
}
