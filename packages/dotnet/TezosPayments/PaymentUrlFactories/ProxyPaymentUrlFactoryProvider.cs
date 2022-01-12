using TezosPayments.Models;

namespace TezosPayments.PaymentUrlFactories;

public class ProxyPaymentUrlFactoryProvider : IPaymentUrlFactoryProvider
{
    public IBase64PaymentUrlFactory Base64PaymentUrlFactory { get; }

    public ProxyPaymentUrlFactoryProvider(
        IBase64PaymentUrlFactory base64PaymentUrlFactory
    )
    {
        Base64PaymentUrlFactory = base64PaymentUrlFactory ?? throw new ArgumentNullException(nameof(base64PaymentUrlFactory));
    }

    public IPaymentUrlFactory GetPaymentUrlFactory(PaymentUrlType paymentUrlType) => paymentUrlType switch
    {
        PaymentUrlType.Base64 => Base64PaymentUrlFactory,
        _ => throw new Exception("Unknown payment url type")
    };
}
