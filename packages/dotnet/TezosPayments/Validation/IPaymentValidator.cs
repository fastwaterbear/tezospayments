using TezosPayments.Models;

namespace TezosPayments.Validation;

public interface IPaymentValidator
{
    ValidationResult Validate(IPayment payment);
}
