namespace TezosPayments.Models;

public record PaymentCreateParameters(string Amount)
{
    public string? Id { get; init; }
    public PaymentAsset? Asset { get; init; }
    public object? Data { get; init; }
    public DateTime? Created { get; init; }
    public DateTime? Expired { get; init; }
    public string? SuccessUrl { get; init; }
    public string? CancelUrl { get; init; }
    public PaymentUrlType? UrlType { get; init; }
}
