using System.Text.Json.Serialization;

namespace TezosPayments.Serialization;

public class SerializedPayment
{
    [JsonPropertyName("i")]
    public string? Id { get; set; }

    [JsonPropertyName("a")]
    public string? Amount { get; set; }

    [JsonPropertyName("t")]
    public string? Target { get; set; }

    [JsonPropertyName("as")]
    public SerializedPaymentAsset? Asset { get; set; }

    [JsonPropertyName("d")]
    public object? Data { get; set; }

    [JsonPropertyName("su")]
    public string? SuccessUrl { get; set; }

    [JsonPropertyName("cu")]
    public string? CancelUrl { get; set; }

    [JsonPropertyName("c")]
    public long Created { get; set; }

    [JsonPropertyName("e")]
    public long? Expired { get; set; }

    [JsonPropertyName("s")]
    public SerializedPaymentSignature? Signature { get; set; }
}
