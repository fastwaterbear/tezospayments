using TezosPayments.Models;

namespace TezosPayments.Serialization;

public interface IPaymentSerializer<TResult> where TResult : class
{
    TResult Serialize(Payment payment);
    Task<TResult> SerializeAsync(Payment payment);
}
