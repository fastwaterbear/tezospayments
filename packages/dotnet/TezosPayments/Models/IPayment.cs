namespace TezosPayments;

public interface IPayment
{
    string Id { get; }
    string TargetAddress { get; }
    string Amount { get; }
    PaymentAsset? Asset { get; }

    DateTime Created { get; }
    DateTime? Expired { get; }

    object? Data { get; }
    Uri? SuccessUrl { get; }
    Uri? CancelUrl { get; }

    PaymentSignature Signature { get; }
    Uri Url { get; }
}
