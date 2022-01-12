using TezosPayments.Models;

namespace TezosPayments;

public interface ITezosPayments
{
    string ServiceContractAddress { get; }
    Network Network { get; }

    Task<Payment> CreatePaymentAsync(PaymentCreateParameters createParameters);
}
