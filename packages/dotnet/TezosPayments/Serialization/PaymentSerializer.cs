using System.Text.Json;
using TezosPayments.Models;

namespace TezosPayments.Serialization;

public class JsonPaymentSerializer : IPaymentSerializer<string>
{
    public JsonSerializerOptions JsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public virtual string Serialize(Payment payment)
        => JsonSerializer.Serialize(MapPaymentToSerializedPayment(payment), JsonSerializerOptions);

    public virtual Task<string> SerializeAsync(Payment payment) => Task.FromResult(Serialize(payment));

    protected virtual SerializedPayment MapPaymentToSerializedPayment(Payment payment) => new()
    {
        Id = payment.Id,
        Amount = payment.Amount,
        Created = new DateTimeOffset(payment.Created).ToUnixTimeMilliseconds(),
        Data = payment.Data,
        Asset = payment.Asset != null ? MapPaymentAssetToSerializedPaymentAsset(payment.Asset) : null,
        SuccessUrl = payment.SuccessUrl?.AbsoluteUri,
        CancelUrl = payment.CancelUrl?.AbsoluteUri,
        Expired = payment.Expired != null ? new DateTimeOffset(payment.Expired.Value).ToUnixTimeMilliseconds() : null,
        Signature = payment.Signature != null ? MapPaymentSignatureToSerializedPaymentSignature(payment.Signature) : null
    };

    protected virtual SerializedPaymentAsset MapPaymentAssetToSerializedPaymentAsset(PaymentAsset paymentAsset)
        => new(paymentAsset.Address, paymentAsset.Decimals, paymentAsset.Id);

    protected virtual SerializedPaymentSignature MapPaymentSignatureToSerializedPaymentSignature(PaymentSignature paymentSignature)
        => new(paymentSignature.Contract, paymentSignature.Client);
}
