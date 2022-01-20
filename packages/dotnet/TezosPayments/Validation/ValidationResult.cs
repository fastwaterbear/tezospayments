namespace TezosPayments.Validation;

public readonly record struct ValidationResult
{
    public bool Success { get; }
    public IEnumerable<string> Errors { get; }

    public ValidationResult(bool success)
        : this(success, (IEnumerable<string>?)null)
    {
    }

    public ValidationResult(bool success, string error)
        : this(success, new string[] { GuardUtils.EnsureStringArgumentIsValid(error, nameof(error)) })
    {
    }

    public ValidationResult(bool success, IEnumerable<string>? errors)
    {
        Success = success;
        Errors = errors ?? Array.Empty<string>();
    }

    public ValidationResult(params ValidationResult[] validationResults)
        : this((IEnumerable<ValidationResult>)validationResults)
    {
    }

    public ValidationResult(IEnumerable<ValidationResult> validationResults)
    {
        static (bool success, IEnumerable<string> errors) AggregateValidationResults(IEnumerable<ValidationResult> validationResults)
        {
            var successResult = true;
            var errorsResult = new List<string>();

            foreach (var (success, errors) in validationResults)
            {
                if (!success)
                {
                    successResult = false;
                    errorsResult.AddRange(errors);
                }
            }

            return (successResult, errorsResult);
        }

        (Success, Errors) = AggregateValidationResults(validationResults);
    }

    public static implicit operator ValidationResult(bool success) => new(success);

    public static implicit operator ValidationResult((bool success, string error) tuple)
        => new(tuple.success, tuple.error);

    public static implicit operator ValidationResult((bool success, IEnumerable<string> errors) tuple)
        => new(tuple.success, tuple.errors);

    public static implicit operator bool(ValidationResult validationResult)
        => validationResult.Success;

    public static implicit operator (bool success, IEnumerable<string> errors)(ValidationResult validationResult)
        => (validationResult.Success, validationResult.Errors);

    public void Deconstruct(out bool success, out IEnumerable<string> errors)
    {
        success = Success;
        errors = Errors;
    }
}
