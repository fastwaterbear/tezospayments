namespace TezosPayments.Signing.SignPayloadEncoding;

public record EncodedPaymentSignPayload
{
    public byte[] ContractSignPayload { get; }
    public byte[]? ClientSignPayload { get; }

    public EncodedPaymentSignPayload(byte[] contractSignPayload, byte[]? clientSignPayload)
    {
        ContractSignPayload = contractSignPayload ?? throw new ArgumentNullException(nameof(contractSignPayload));
        ClientSignPayload = clientSignPayload;
    }
}
