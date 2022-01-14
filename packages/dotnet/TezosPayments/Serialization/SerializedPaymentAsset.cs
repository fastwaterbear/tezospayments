using System.Text.Json.Serialization;

namespace TezosPayments.Serialization;

public readonly struct SerializedPaymentAsset
{
    [JsonPropertyName("a")]
    public string Address { get; }

    [JsonPropertyName("d")]
    public ushort Decimals { get; }

    [JsonPropertyName("i")]
    public ulong? Id { get; }

    [JsonConstructor]
    public SerializedPaymentAsset(string address, ushort decimals, ulong? id)
        => (Address, Decimals, Id) = (address, decimals, id);
}
