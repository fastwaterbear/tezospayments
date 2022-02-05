using TezosPayments.Models;

namespace TezosPayments;

public interface ITezosPaymentsClient
{
    string ServiceContractAddress { get; }
    Network Network { get; }

    Task<IPayment> CreatePaymentAsync(PaymentCreateParameters createParameters);
}
