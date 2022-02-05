using TezosPayments.Models;

namespace TezosPayments;

public record DefaultPaymentParameters : IDefaultPaymentParameters
{
    public PaymentUrlType UrlType { get; set; } = Constants.PaymentUrlType;
}
