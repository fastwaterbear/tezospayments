using TezosPayments.Models;

namespace TezosPayments.Serialization;

public class Base64PaymentSerializer : IBase64PaymentSerializer
{
    public string Serialize(Payment payment)
    {
        // TODO: implement
        return "serializedPayment";
    }

    public Task<string> SerializeAsync(Payment payment)
    {
        // TODO: implement
        return Task.FromResult("serializedPayment");
    }
}
