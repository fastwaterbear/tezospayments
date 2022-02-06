namespace TezosPayments.Signing.Signers;

public interface IPaymentSigner
{
    Task<PaymentSignature> SignAsync(Payment payment);
}
