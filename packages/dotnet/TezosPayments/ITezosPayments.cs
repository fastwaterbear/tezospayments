using TezosPayments.Models;

namespace TezosPayments;

public interface ITezosPayments
{
    string ServiceContractAddress { get; }
    Network Network { get; }

    Task<IPayment> CreatePaymentAsync(PaymentCreateParameters createParameters);
}
