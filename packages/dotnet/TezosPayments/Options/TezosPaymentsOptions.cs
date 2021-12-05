using TezosPayments.Models;

namespace TezosPayments.Options;

public record TezosPaymentsOptions(
    string ServiceContractAddress,
    ITezosPaymentsSigningOptions Signing,
    DefaultPaymentParameters? DefaultPaymentParameters
);

public record DefaultPaymentParameters
{
    public Network? Network { get; set; }
    public PaymentUrlType UrlType { get; set; }
}