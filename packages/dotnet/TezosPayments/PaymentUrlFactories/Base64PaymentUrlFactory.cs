using TezosPayments.Models;
using TezosPayments.Serialization;

namespace TezosPayments.PaymentUrlFactories;

public class Base64PaymentUrlFactory : IBase64PaymentUrlFactory, IPaymentUrlFactory
{
    public PaymentUrlType UrlType => PaymentUrlType.Base64;
    public Uri BaseUrl { get; }
    protected IBase64PaymentSerializer PaymentSerializer { get; }
    protected Lazy<string> EncodedUrlType => new(((byte)UrlType).ToString().PadLeft(2, '0'));

    public Base64PaymentUrlFactory(string baseUrl, IBase64PaymentSerializer paymentSerializer)
    {
        BaseUrl = new Uri(GuardUtils.EnsureStringArgumentIsValid(baseUrl, nameof(baseUrl)));
        PaymentSerializer = paymentSerializer ?? throw new ArgumentNullException(nameof(paymentSerializer));
    }

    public Base64PaymentUrlFactory(IBase64PaymentSerializer paymentSerializer)
        : this(Constants.PAYMENT_APP_BASE_URL, paymentSerializer)
    {
    }

    public Uri CreatePaymentUrl(Payment payment, Network network)
    {
        var serializedPayment = PaymentSerializer.Serialize(payment);

        return CreateUrl(payment.TargetAddress, serializedPayment, network);
    }

    public async Task<Uri> CreatePaymentUrlAsync(Payment payment, Network network)
    {
        var serializedPayment = await PaymentSerializer.SerializeAsync(payment);

        return CreateUrl(payment.TargetAddress, serializedPayment, network);
    }

    protected Uri CreateUrl(string targetAddress, string base64SerializedPayment, Network network)
    {
        var urlBuilder = new UriBuilder(BaseUrl)
        {
            Path = $"{targetAddress}/payment",
            Fragment = EncodedUrlType.Value + base64SerializedPayment
        };

        if (network.Name != Constants.DefaultNetwork.Name)
            urlBuilder.Query = $"network={network.Name}";

        return urlBuilder.Uri;
    }
}
