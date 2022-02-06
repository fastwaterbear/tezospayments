namespace TezosPayments.PaymentUrlFactories;

public interface IPaymentUrlFactory
{
    PaymentUrlType UrlType { get; }

    Uri CreatePaymentUrl(Payment payment, Network network);
    Task<Uri> CreatePaymentUrlAsync(Payment payment, Network network);
}
