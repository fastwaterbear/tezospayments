using TezosPayments.Models;

namespace TezosPayments;

public record TezosPaymentDefaultOptions
{
    public Network Network { get; set; } = Constants.DefaultNetwork;
    public string? ServiceContractDomain { get; set; }
}
