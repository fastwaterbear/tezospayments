namespace TezosPayments.Models;

public record PaymentSignature
{
    public string Contract { get; }
    public string? Client { get; }

    public PaymentSignature(string contract, string? client)
    {
        Contract = GuardUtils.EnsureStringArgumentIsValid(contract, nameof(contract));
        Client = client == null ? null : GuardUtils.EnsureStringArgumentIsValid(client, nameof(client));
    }
}
