namespace TezosPayments;

public readonly record struct PaymentCreateParameters(string Amount)
{
    public string? Id { get; init; } = default;
    public PaymentAsset? Asset { get; init; } = default;
    public object? Data { get; init; } = default;
    public DateTime? Created { get; init; } = default;
    public DateTime? Expired { get; init; } = default;
    public string? SuccessUrl { get; init; } = default;
    public string? CancelUrl { get; init; } = default;
    public PaymentUrlType? UrlType { get; init; } = default;
}
