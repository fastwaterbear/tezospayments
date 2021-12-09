using TezosPayments.Models;

namespace TezosPayments.Options;

public record TezosPaymentsOptions
{
    public string ServiceContractAddress { get; }
    public Network? Network { get; set; }

    public TezosPaymentsOptions(string serviceContractAddress)
    {
        ServiceContractAddress = GuardUtils.EnsureStringArgumentIsValid(serviceContractAddress, nameof(serviceContractAddress));
    }
}
