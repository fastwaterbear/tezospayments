using TezosPayments.Models;

namespace TezosPayments;

public interface ITezosPayments
{
    Task<Payment> CreatePaymentAsync(PaymentCreateParameters createParameters);
}
