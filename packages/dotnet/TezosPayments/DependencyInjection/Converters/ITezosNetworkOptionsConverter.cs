namespace TezosPayments.DependencyInjection.Converters;

public interface ITezosNetworkOptionsConverter
{
    Network? Convert(TezosNetworkOptions? options);
}
