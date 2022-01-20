using TezosPayments.PaymentUrlFactories;
using TezosPayments.Signing.Signers;
using TezosPayments.Validation;

namespace TezosPayments.Models;

public partial class Payment
{
    internal ValidationResult Validate(IPaymentValidator paymentValidator)
    {
        if (paymentValidator == null)
            throw new ArgumentNullException(nameof(paymentValidator));

        IsValid = paymentValidator.Validate(this);

        return IsValid.Value;
    }

    internal async Task<PaymentSignature> SignAsync(IPaymentSigner paymentSigner)
    {
        if (paymentSigner == null)
            throw new ArgumentNullException(nameof(paymentSigner));

        Signature = await paymentSigner.SignAsync(this);

        return Signature;
    }

    internal Uri CreateUrl(IPaymentUrlFactory paymentUrlFactory, Network network)
    {
        if (paymentUrlFactory == null)
            throw new ArgumentNullException(nameof(paymentUrlFactory));

        Url = paymentUrlFactory.CreatePaymentUrl(this, network);

        return Url;
    }

    internal async Task<Uri> CreateUrlAsync(IPaymentUrlFactory paymentUrlFactory, Network network)
    {
        if (paymentUrlFactory == null)
            throw new ArgumentNullException(nameof(paymentUrlFactory));

        Url = await paymentUrlFactory.CreatePaymentUrlAsync(this, network);

        return Url;
    }
}
