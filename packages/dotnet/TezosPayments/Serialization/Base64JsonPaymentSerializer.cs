using TezosPayments.Models;

namespace TezosPayments.Serialization;

public class Base64JsonPaymentSerializer : JsonPaymentSerializer, IBase64JsonPaymentSerializer
{
    public override string Serialize(Payment payment)
    {
        var json = base.Serialize(payment);

        return TextUtils.EncodeToBase64Url(json);
    }

    public override async Task<string> SerializeAsync(Payment payment)
    {
        var json = await base.SerializeAsync(payment);

        return TextUtils.EncodeToBase64Url(json);
    }
}
