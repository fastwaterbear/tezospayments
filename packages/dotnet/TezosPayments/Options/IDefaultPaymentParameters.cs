using TezosPayments.Models;

namespace TezosPayments;

public interface IDefaultPaymentParameters
{
    PaymentUrlType UrlType { get; }
}
