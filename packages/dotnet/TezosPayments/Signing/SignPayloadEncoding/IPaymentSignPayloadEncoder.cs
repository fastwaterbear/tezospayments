using TezosPayments.Models;

namespace TezosPayments.Signing.SignPayloadEncoding;

public interface IPaymentSignPayloadEncoder
{
    EncodedPaymentSignPayload Encode(Payment payment);
}
