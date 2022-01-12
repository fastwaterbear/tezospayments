using TezosPayments.Models;

namespace TezosPayments.Signing.SignPayloadEncoding;

public class PaymentSignPayloadEncoder : IPaymentSignPayloadEncoder
{
    public EncodedPaymentSignPayload Encode(Payment payment)
    {
        // TODO: implement
        return new("contractPayload", null);
    }
}
