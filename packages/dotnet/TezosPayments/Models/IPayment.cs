namespace TezosPayments.Models;

public interface IPayment
{
    public string Id { get; }
    public string TargetAddress { get; }
    public string Amount { get; }
    PaymentAsset? Asset { get; }

    DateTime Created { get; }
    DateTime? Expired { get; }

    object? Data { get; }
    Uri? SuccessUrl { get; }
    Uri? CancelUrl { get; }

    PaymentSignature Signature { get; }
    Uri Url { get; }
}
