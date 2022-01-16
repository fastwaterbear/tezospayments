using System.Text.Json.Serialization;

namespace TezosPayments.Signing;

public class ClientSignPayload
{
    [JsonPropertyOrder(0)]
    public object? Data { get; set; }
    [JsonPropertyOrder(1)]
    public string? SuccessUrl { get; set; }
    [JsonPropertyOrder(2)]
    public string? CancelUrl { get; set; }

    [JsonIgnore]
    public bool IsEmpty => SuccessUrl == null
        && CancelUrl == null
        && Data == null;
}
