using TezosPayments.Models;

namespace TezosPayments.Options;

public record DefaultPaymentParameters : IDefaultPaymentParameters
{
    public PaymentUrlType UrlType { get; set; } = Constants.PaymentUrlType;
}
