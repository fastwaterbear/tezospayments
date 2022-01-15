using Netezos.Encoding;
using Netezos.Keys;
using TezosPayments.Models;
using TezosPayments.Signing.SignPayloadEncoding;
using TezosPayments.Tezos;
using TezosPayments.Tezos.Constants;

namespace TezosPayments.Signing.Signers;

public class ApiSecretKeyPaymentSigner : IPaymentSigner
{
    protected const int KEY_BYTES_LENGTH = 32;

    public Key ApiKey { get; }
    public IPaymentSignPayloadEncoder PaymentSignPayloadEncoder { get; }

    public ApiSecretKeyPaymentSigner(string apiSecretKey, IPaymentSignPayloadEncoder paymentSignPayloadEncoder)
    {
        GuardUtils.EnsureStringArgumentIsValid(apiSecretKey, nameof(apiSecretKey));
        PaymentSignPayloadEncoder = paymentSignPayloadEncoder ?? throw new ArgumentNullException(nameof(paymentSignPayloadEncoder));

        ApiKey = ParseApiSecretKey(apiSecretKey);
    }

    public Task<PaymentSignature> SignAsync(Payment payment)
    {
        var signPayload = PaymentSignPayloadEncoder.Encode(payment);

        var contractSignature = ApiKey.Sign(signPayload.ContractSignPayload).ToString();
        var clientSignature = signPayload.ClientSignPayload != null 
            ? ApiKey.Sign(signPayload.ClientSignPayload).ToString() 
            : null;

        var paymentSignature = new PaymentSignature(contractSignature, clientSignature);

        return Task.FromResult(paymentSignature);
    }

    protected virtual Key ParseApiSecretKey(string apiSecretKey)
    {
        if (apiSecretKey.StartsWith(Prefix.Text.EDSK))
            return ParseEd25519ApiSecretKey(apiSecretKey);

        if (apiSecretKey.StartsWith(Prefix.Text.SPSK))
            throw new NotImplementedException();

        if (apiSecretKey.StartsWith(Prefix.Text.P2SK))
            throw new NotImplementedException();

        throw new Exception("Unsupported key type");
    }

    protected virtual Key ParseEd25519ApiSecretKey(string apiSecretKey)
    {
        var rawApiKeyBytes = Base58.Parse(apiSecretKey, Prefix.Binary.EDSK);

        if (rawApiKeyBytes == null || (
            rawApiKeyBytes.Length != KEY_BYTES_LENGTH && rawApiKeyBytes.Length != (KEY_BYTES_LENGTH * 2)
        ))
        {
            throw new Exception("Invalid Ed25519 API secret key");
        }

        var (apiSecretKeyBytes, _) = ExtractEd25519KeyParts(rawApiKeyBytes);

        return Key.FromBytes(apiSecretKeyBytes, ECKind.Ed25519);
    }

    protected static (byte[] apiSecretKeyBytes, byte[]? apiPublicKeyBytes) ExtractEd25519KeyParts(byte[] key)
        => key.Length == KEY_BYTES_LENGTH
            ? (key, null)
            : (key[..KEY_BYTES_LENGTH], key[KEY_BYTES_LENGTH..]);
}
