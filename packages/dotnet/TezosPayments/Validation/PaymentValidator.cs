namespace TezosPayments.Validation;

public class PaymentValidator : IPaymentValidator
{
    public virtual ValidationResult Validate(IPayment payment) => new(
        ValidateId(payment),
        ValidateTargetAddress(payment),
        ValidateAmount(payment),
        ValidatePaymentAsset(payment),
        ValidateData(payment),
        ValidateSuccessUrl(payment),
        ValidateCancelUrl(payment),
        ValidateCreatedDate(payment),
        ValidateExpiredDate(payment)
    );

    public virtual ValidationResult ValidateId(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidateTargetAddress(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidateAmount(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidatePaymentAsset(IPayment payment)
    {
        return true;
    }


    public virtual ValidationResult ValidateData(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidateSuccessUrl(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidateCancelUrl(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidateCreatedDate(IPayment payment)
    {
        return true;
    }

    public virtual ValidationResult ValidateExpiredDate(IPayment payment)
    {
        return true;
    }
}
