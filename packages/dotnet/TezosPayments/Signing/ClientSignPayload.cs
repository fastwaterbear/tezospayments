using System.Text.Json.Serialization;

namespace TezosPayments.Signing;

public class ClientSignPayload
{
    public string? SuccessUrl { get; set; }
    public string? CancelUrl { get; set; }
    public object? Data { get; set; }

    [JsonIgnore]
    public bool IsEmpty => SuccessUrl == null
        && CancelUrl == null
        && Data == null;
}
