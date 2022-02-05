using System;
using System.Text.Json;

namespace TezosPayments.Tests.TestHelpers;

public record class TestPayment : IPayment, IEquatable<Payment>
{
    public string Id { get; set; } = default!;

    public string TargetAddress { get; set; } = default!;

    public string Amount { get; set; } = default!;

    public PaymentAsset? Asset { get; set; } = default!;

    public DateTime Created { get; set; } = default!;

    public DateTime? Expired { get; set; } = default!;

    public object? Data { get; set; } = default!;

    public Uri? SuccessUrl { get; set; } = default!;

    public Uri? CancelUrl { get; set; } = default!;

    public PaymentSignature Signature { get; set; } = default!;

    public Uri Url { get; set; } = default!;

    public bool Equals(Payment? payment)
    {
        return payment != null
            && payment.Id == Id
            && payment.TargetAddress == TargetAddress
            && payment.Amount == Amount
            && payment.Asset == Asset
            && payment.Created == Created
            && payment.Expired == Expired
            && JsonSerializer.Serialize(payment.Data) == JsonSerializer.Serialize(Data)
            && payment.SuccessUrl?.AbsoluteUri == SuccessUrl?.AbsoluteUri
            && payment.CancelUrl?.AbsoluteUri == CancelUrl?.AbsoluteUri
            && payment.Signature == Signature
            && payment.Url?.AbsoluteUri == Url.AbsoluteUri;
    }
}
