namespace TezosPayments;

public record PaymentSignature
{
    public string SigningPublicKey { get; }
    public string Contract { get; }
    public string? Client { get; }

    public PaymentSignature(string signingPublicKey, string contract, string? client)
    {
        SigningPublicKey = GuardUtils.EnsureStringArgumentIsValid(signingPublicKey, nameof(signingPublicKey));
        Contract = GuardUtils.EnsureStringArgumentIsValid(contract, nameof(contract));
        Client = client == null ? null : GuardUtils.EnsureStringArgumentIsValid(client, nameof(client));
    }
}
