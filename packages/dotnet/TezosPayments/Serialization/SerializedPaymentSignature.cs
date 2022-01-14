using System.Text.Json.Serialization;

namespace TezosPayments.Serialization;

public readonly struct SerializedPaymentSignature
{
    [JsonPropertyName("c")]
    public string Contract { get; }

    [JsonPropertyName("cl")]
    public string? Client { get; }

    [JsonConstructor]
    public SerializedPaymentSignature(string contract, string? client)
        => (Contract, Client) = (contract, client);
}
