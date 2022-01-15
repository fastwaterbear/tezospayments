using TezosPayments.Models;

namespace TezosPayments.PaymentUrlFactories;

public interface IPaymentUrlFactoryProvider
{
    IPaymentUrlFactory GetPaymentUrlFactory(PaymentUrlType paymentUrlType);
}
