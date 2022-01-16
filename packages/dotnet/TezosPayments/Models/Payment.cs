using TezosPayments.Validation;

namespace TezosPayments.Models;

public partial class Payment : IPayment
{
    private readonly DateTime? expired;

    public string Id { get; }
    public string TargetAddress { get; }
    public string Amount { get; }
    public PaymentAsset? Asset { get; }
    public DateTime Created { get; }

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
    public ValidationResult? IsValid { get; private set; }

    public Payment(
        string id,
        string targetAddress,
        string amount,
        PaymentAsset? asset,
        DateTime? created = null
    )
    {
        Id = GuardUtils.EnsureStringArgumentIsValid(id, nameof(id));
        TargetAddress = GuardUtils.EnsureStringArgumentIsValid(targetAddress, nameof(targetAddress));
        Amount = GuardUtils.EnsureStringArgumentIsValid(amount, nameof(amount));

        Asset = asset;
        Created = created ?? DateTime.UtcNow;
    }
}
