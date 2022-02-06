namespace TezosPayments;

public partial class Payment : IPayment
{
    PaymentSignature IPayment.Signature
    {
        get => Signature ?? throw new Exception("The payment has not been filled yet");
    }

    Uri IPayment.Url
    {
        get => Url ?? throw new Exception("The payment has not been filled yet");
    }
}
