using System.Text.Json;
using TezosPayments.Models;

namespace TezosPayments.Serialization;

public class JsonPaymentSerializer : IPaymentSerializer<string>
{
    public JsonSerializerOptions JsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public virtual string Serialize(Payment payment) => SerializeInternal(payment);

    public virtual Task<string> SerializeAsync(Payment payment) => Task.FromResult(SerializeInternal(payment));

    protected virtual SerializedPayment MapPaymentToSerializedPayment(Payment payment) => new()
    {
        Id = payment.Id,
        Amount = payment.Amount.TrimEnd('0').TrimEnd('.'),
        Target = payment.TargetAddress,
        Asset = payment.Asset != null ? MapPaymentAssetToSerializedPaymentAsset(payment.Asset) : null,
        Data = payment.Data,
        SuccessUrl = payment.SuccessUrl?.AbsoluteUri,
        CancelUrl = payment.CancelUrl?.AbsoluteUri,
        Created = new DateTimeOffset(payment.Created).ToUnixTimeMilliseconds(),
        Expired = payment.Expired != null ? new DateTimeOffset(payment.Expired.Value).ToUnixTimeMilliseconds() : null,
        Signature = payment.Signature != null ? MapPaymentSignatureToSerializedPaymentSignature(payment.Signature) : null
    };

    protected virtual SerializedPaymentAsset MapPaymentAssetToSerializedPaymentAsset(PaymentAsset paymentAsset)
        => new(paymentAsset.Address, paymentAsset.Decimals, paymentAsset.Id);

    protected virtual SerializedPaymentSignature MapPaymentSignatureToSerializedPaymentSignature(PaymentSignature paymentSignature)
        => new(paymentSignature.SigningPublicKey, paymentSignature.Contract, paymentSignature.Client);

    private string SerializeInternal(Payment payment)
        => JsonSerializer.Serialize(MapPaymentToSerializedPayment(payment), JsonSerializerOptions);
}
