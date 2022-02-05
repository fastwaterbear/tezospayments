namespace TezosPayments.Validation;

public interface IPaymentValidator
{
    ValidationResult Validate(IPayment payment);
}
