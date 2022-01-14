using System.Text.Json.Serialization;

namespace TezosPayments.Serialization;

public class SerializedPayment
{
    [JsonPropertyName("i")]
    public string Id { get; set; } = default!;

    [JsonPropertyName("a")]
    public string Amount { get; set; } = default!;

    [JsonPropertyName("c")]
    public long Created { get; set; }

    [JsonPropertyName("d")]
    public object? Data { get; set; }

    [JsonPropertyName("as")]
    public SerializedPaymentAsset? Asset { get; set; }

    [JsonPropertyName("su")]
    public string? SuccessUrl { get; set; }

    [JsonPropertyName("cu")]
    public string? CancelUrl { get; set; }

    [JsonPropertyName("e")]
    public long? Expired { get; set; }

    [JsonPropertyName("s")]
    public SerializedPaymentSignature? Signature { get; set; }
}
