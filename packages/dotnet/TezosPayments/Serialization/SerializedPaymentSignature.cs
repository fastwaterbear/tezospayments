using System.Text.Json.Serialization;

namespace TezosPayments.Serialization;

public readonly struct SerializedPaymentSignature
{
    [JsonPropertyName("k")]
    public string SigningPublicKey { get; }

    [JsonPropertyName("c")]
    public string Contract { get; }

    [JsonPropertyName("cl")]
    public string? Client { get; }

    [JsonConstructor]
    public SerializedPaymentSignature(string signingPublicKey, string contract, string? client)
        => (SigningPublicKey, Contract, Client) = (signingPublicKey, contract, client);
}
