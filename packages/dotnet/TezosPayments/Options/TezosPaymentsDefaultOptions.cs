namespace TezosPayments;

public record TezosPaymentsDefaultOptions
{
    public Network Network { get; set; } = Constants.DefaultNetwork;
    public string? ServiceContractDomain { get; set; }
}
