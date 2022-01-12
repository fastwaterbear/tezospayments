namespace TezosPayments.Signing.SignPayloadEncoding;

public record EncodedPaymentSignPayload
{
    public string ContractSignPayload { get; }
    public string? ClientSignPayload { get; }

    public EncodedPaymentSignPayload(string contractSignPayload, string? clientSignPayload)
    {
        ContractSignPayload = GuardUtils.EnsureStringArgumentIsValid(contractSignPayload, nameof(contractSignPayload));
        ClientSignPayload = clientSignPayload == null ? null : GuardUtils.EnsureStringArgumentIsValid(clientSignPayload, nameof(clientSignPayload));
    }
}
