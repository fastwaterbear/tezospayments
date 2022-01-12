using TezosPayments.Models;
using TezosPayments.Signing.SignPayloadEncoding;

namespace TezosPayments.Signing.Signers;

public class ApiSecretKeyPaymentSigner : IPaymentSigner
{
    public string ApiSecretKey { get; }
    public IPaymentSignPayloadEncoder PaymentSignPayloadEncoder { get; }

    public ApiSecretKeyPaymentSigner(string apiSecretKey, IPaymentSignPayloadEncoder paymentSignPayloadEncoder)
    {
        ApiSecretKey = GuardUtils.EnsureStringArgumentIsValid(apiSecretKey, nameof(apiSecretKey));
        PaymentSignPayloadEncoder = paymentSignPayloadEncoder ?? throw new ArgumentNullException(nameof(paymentSignPayloadEncoder));
    }

    public Task<PaymentSignature> SignAsync(Payment payment)
    {
        // TODO: implement
        var signPayload = PaymentSignPayloadEncoder.Encode(payment);
        var contractSignature = "edsigDummy";
        var clientSignature = signPayload.ClientSignPayload != null ? "edsigDummy" : null;

        var paymentSignature = new PaymentSignature(contractSignature, clientSignature);

        return Task.FromResult(paymentSignature);
    }
}
