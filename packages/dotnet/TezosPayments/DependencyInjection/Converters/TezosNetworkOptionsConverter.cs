using TezosPayments.Models;

namespace TezosPayments.DependencyInjection.Converters;

public class TezosNetworkOptionsConverter : ITezosNetworkOptionsConverter
{
    public Network? Convert(TezosNetworkOptions? options) => options switch
    {
        null => null,
        { Name: null, Id: null } => null,
        { Name: not null } => Network.CreateOrGetNetwork(options.Id, options.Name),
        { Name: null, Id: not null } => throw new Exception("Network should have a name")
    };
}
