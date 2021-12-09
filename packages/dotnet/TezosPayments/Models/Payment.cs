namespace TezosPayments.Models;

public partial class Payment
{
    private readonly DateTime created = DateTime.UtcNow;
    private readonly DateTime? expired;

    public string Id { get; }
    public string TargetAddress { get; }
    public string Amount { get; }
    public PaymentAsset? Asset { get; }

    public DateTime? Created
    {
        get => created;
        init
        {
            if (value != null)
                created = DateTime.UtcNow;
        }
    }
    public DateTime? Expired
    {
        get => expired;
        init => expired = value == null || value.Value > Created
            ? value
            : throw new ArgumentOutOfRangeException(nameof(value), $"The {nameof(Expired)} should be more than the {nameof(Created)}");
    }

    public object? Data { get; init; }
    public Uri? SuccessUrl { get; init; }
    public Uri? CancelUrl { get; init; }

    public PaymentSignature? Signature { get; private set; }
    public Uri? Url { get; private set; }

    public Payment(
        string id,
        string targetAddress,
        string amount,
        PaymentAsset? asset
    )
    {
        Id = GuardUtils.EnsureStringArgumentIsValid(id, nameof(id));
        TargetAddress = GuardUtils.EnsureStringArgumentIsValid(targetAddress, nameof(targetAddress));
        Amount = GuardUtils.EnsureStringArgumentIsValid(amount, nameof(amount));

        Asset = asset;
    }
}
