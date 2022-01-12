using TezosPayments.Models;

namespace TezosPayments.DependencyInjection;

public record TezosPaymentsOptions
{
    public string ServiceContractAddress { get; set; } = default!;
    public string ApiSecretKey { get; set; } = default!;

    public Network? Network { get; set; }
    public string? ServiceContractDomain { get; set; }
    public PaymentUrlType? DefaultPaymentUrlType { get; set; }

    internal void Validate()
    {
        // TODO: implement
    }
}
