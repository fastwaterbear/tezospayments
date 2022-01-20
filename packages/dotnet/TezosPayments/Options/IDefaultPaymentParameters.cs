using TezosPayments.Models;

namespace TezosPayments.Options;

public interface IDefaultPaymentParameters
{
    PaymentUrlType UrlType { get; }
}
