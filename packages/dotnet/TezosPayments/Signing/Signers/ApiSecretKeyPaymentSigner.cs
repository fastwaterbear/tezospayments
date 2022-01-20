using Netezos.Encoding;
using Netezos.Keys;
using TezosPayments.Models;
using TezosPayments.Signing.SignPayloadEncoding;
using TezosPayments.Tezos.Constants;

namespace TezosPayments.Signing.Signers;

public class ApiSecretKeyPaymentSigner : IPaymentSigner
{
    protected const int KEY_BYTES_LENGTH = 32;

    public IPaymentSignPayloadEncoder PaymentSignPayloadEncoder { get; }

    protected Key ApiKey { get; }
    protected string SigningPublicKey { get; }

    public ApiSecretKeyPaymentSigner(string apiSecretKey, IPaymentSignPayloadEncoder paymentSignPayloadEncoder)
    {
        GuardUtils.EnsureStringArgumentIsValid(apiSecretKey, nameof(apiSecretKey));
        PaymentSignPayloadEncoder = paymentSignPayloadEncoder ?? throw new ArgumentNullException(nameof(paymentSignPayloadEncoder));

        ApiKey = ParseApiSecretKey(apiSecretKey);
        SigningPublicKey = ApiKey.PubKey.GetBase58();
    }

    public Task<PaymentSignature> SignAsync(Payment payment)
    {
        var signPayload = PaymentSignPayloadEncoder.Encode(payment);

        var contractSignature = ApiKey.Sign(signPayload.ContractSignPayload).ToString();
        var clientSignature = signPayload.ClientSignPayload != null
            ? ApiKey.Sign(signPayload.ClientSignPayload).ToString()
            : null;

        var paymentSignature = new PaymentSignature(SigningPublicKey, contractSignature, clientSignature);

        return Task.FromResult(paymentSignature);
    }

    protected virtual Key ParseApiSecretKey(string apiSecretKey)
    {
        if (apiSecretKey.StartsWith(Prefix.Text.EDSK))
            return ParseEd25519ApiSecretKey(apiSecretKey);

        if (apiSecretKey.StartsWith(Prefix.Text.SPSK))
            return ParseSecp256k1ApiSecretKey(apiSecretKey);

        if (apiSecretKey.StartsWith(Prefix.Text.P2SK))
            return ParseNistP256ApiSecretKey(apiSecretKey);

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

    protected virtual Key ParseSecp256k1ApiSecretKey(string apiSecretKey)
    {
        var apiSecretKeyBytes = Base58.Parse(apiSecretKey, Prefix.Binary.SPSK);

        return Key.FromBytes(apiSecretKeyBytes, ECKind.Secp256k1);
    }

    protected virtual Key ParseNistP256ApiSecretKey(string apiSecretKey)
    {
        var apiSecretKeyBytes = Base58.Parse(apiSecretKey, Prefix.Binary.P2SK);

        return Key.FromBytes(apiSecretKeyBytes, ECKind.NistP256);
    }

    protected static (byte[] apiSecretKeyBytes, byte[]? apiPublicKeyBytes) ExtractEd25519KeyParts(byte[] key)
        => key.Length == KEY_BYTES_LENGTH
            ? (key, null)
            : (key[..KEY_BYTES_LENGTH], key[KEY_BYTES_LENGTH..]);
}
