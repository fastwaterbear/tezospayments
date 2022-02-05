using TezosPayments.Validation;

namespace TezosPayments;

public partial class Payment : IPayment
{
    public const char AMOUNT_DECIMAL_SEPARATOR = '.';
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
        Asset = asset;
        Amount = PrepareAmount(GuardUtils.EnsureStringArgumentIsValid(amount, nameof(amount)), Asset);
        Created = created ?? DateTime.UtcNow;
    }

    private string PrepareAmount(string amount, PaymentAsset? asset)
    {
        var expectedDecimalsCount = asset?.Decimals ?? Tezos.Constants.Tokens.Decimals;
        var decimalSeparatorIndex = amount.LastIndexOf(AMOUNT_DECIMAL_SEPARATOR);
        if (decimalSeparatorIndex == -1)
        {
            return expectedDecimalsCount > 0
                ? $"{amount}.{new string('0', expectedDecimalsCount)}"
                : amount;
        }

        var actualDecimalsCount = amount.Length - 1 - decimalSeparatorIndex;
        var amountStringTotalWidth = decimalSeparatorIndex + (expectedDecimalsCount > 0 ? expectedDecimalsCount + 1 : 0);
        if (actualDecimalsCount < expectedDecimalsCount)
            return amount.PadRight(amountStringTotalWidth, '0');
        if (actualDecimalsCount > expectedDecimalsCount || actualDecimalsCount == 0)
            return amount[0..amountStringTotalWidth];

        return amount;
    }
}
