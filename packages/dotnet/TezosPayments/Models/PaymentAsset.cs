namespace TezosPayments;

public record PaymentAsset
{
    public string Address { get; }
    public ushort Decimals { get; }
    public ulong? Id { get; }

    public PaymentAsset(string address, ushort decimals, ulong? id)
    {
        Address = GuardUtils.EnsureStringArgumentIsValid(address, nameof(address));
        Decimals = decimals;
        Id = id;
    }
}
