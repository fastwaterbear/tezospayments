using System.Numerics;
using System.Text;
using System.Text.Json;
using Netezos.Encoding;
using Netezos.Forging;

namespace TezosPayments.Signing.SignPayloadEncoding;

public class PaymentSignPayloadEncoder : IPaymentSignPayloadEncoder
{
    private const byte CONTRACT_SIGN_PAYLOAD_PREFIX_BYTE = 5;

    protected static readonly byte[] clientSignPayloadMessagePrefixBytes = new byte[] { CONTRACT_SIGN_PAYLOAD_PREFIX_BYTE, 1 };
    // "Tezos Signed Message: "
    protected static readonly byte[] tezosSignedMessagePrefixBytes = new byte[] {
        84, 101, 122, 111, 115, 32, 83, 105, 103, 110, 101, 100, 32, 77, 101, 115, 115, 97, 103, 101, 58, 32
    };
    // "Payment Client Data: "
    protected static readonly byte[] tezosPaymentsClientSignedMessagePrefixBytes = new byte[] {
        80, 97, 121, 109, 101, 110, 116, 32, 67, 108, 105, 101, 110, 116, 32, 68, 97, 116, 97, 58, 32
    };

    protected JsonSerializerOptions JsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public EncodedPaymentSignPayload Encode(Payment payment)
    {
        return new(GetContractSignPayload(payment), GetClientSignPayload(payment));
    }

    protected virtual byte[] GetContractSignPayload(Payment payment)
    {
        var payloadMicheline = payment.Asset != null
            ? GetPayloadWithAssetMicheline(payment)
            : GetPayloadWithoutAssetMicheline(payment);

        var payloadBytesWithoutPrefix = LocalForge.ForgeMicheline(payloadMicheline);

        var result = new byte[payloadBytesWithoutPrefix.Length + 1];
        result[0] = CONTRACT_SIGN_PAYLOAD_PREFIX_BYTE;
        Buffer.BlockCopy(payloadBytesWithoutPrefix, 0, result, 1, payloadBytesWithoutPrefix.Length);

        return result;
    }

    protected virtual byte[]? GetClientSignPayload(Payment payment)
    {
        var clientSignPayload = new ClientSignPayload()
        {
            Data = payment.Data,
            SuccessUrl = payment.SuccessUrl?.AbsoluteUri,
            CancelUrl = payment.CancelUrl?.AbsoluteUri,
        };
        if (clientSignPayload.IsEmpty)
            return null;

        var clientSignPayloadString = JsonSerializer.Serialize(clientSignPayload, JsonSerializerOptions);
        var clientSignPayloadBytes = Encoding.UTF8.GetBytes(clientSignPayloadString);
        var messageLengthBytes = LocalForge.ForgeInt32(
            tezosSignedMessagePrefixBytes.Length
            + tezosPaymentsClientSignedMessagePrefixBytes.Length
            + clientSignPayloadBytes.Length
        );
        var result = BytesUtils.Combine(
            clientSignPayloadMessagePrefixBytes,
            messageLengthBytes,
            tezosSignedMessagePrefixBytes,
            tezosPaymentsClientSignedMessagePrefixBytes,
            clientSignPayloadBytes
        );

        return result;
    }

    protected virtual IMicheline GetPayloadWithoutAssetMicheline(Payment payment)
    {
        var encodedTargetAddress = LocalForge.ForgeAddress(payment.TargetAddress);
        var amount = ConvertAmountToNatBigInteger(payment.Amount);

        return new MichelinePrim()
        {
            Prim = PrimType.Pair,
            Args = new List<IMicheline>()
            {
                new MichelinePrim() {
                    Prim = PrimType.Pair,
                    Args = new List<IMicheline>
                    {
                        new MichelineString(payment.Id),
                        new MichelineBytes(encodedTargetAddress)
                    }
                },
                new MichelineInt(amount),
            }
        };
    }

    protected virtual IMicheline GetPayloadWithAssetMicheline(Payment payment)
    {
        var encodedTargetAddress = LocalForge.ForgeAddress(payment.TargetAddress);
        var encodedAssetAddress = LocalForge.ForgeAddress(payment.Asset!.Address);
        var amount = ConvertAmountToNatBigInteger(payment.Amount);

        return new MichelinePrim()
        {
            Prim = PrimType.Pair,
            Args = new List<IMicheline>()
            {
                new MichelinePrim() {
                    Prim = PrimType.Pair,
                    Args = new List<IMicheline>()
                    {
                        new MichelinePrim() {
                            Prim = PrimType.Pair,
                            Args = new List<IMicheline>
                            {
                                new MichelineString(payment.Id),
                                new MichelineBytes(encodedTargetAddress)
                            }
                        },
                        new MichelinePrim() {
                            Prim = PrimType.Pair,
                            Args = new List<IMicheline>
                            {
                                new MichelineInt(amount),
                                new MichelineBytes(encodedAssetAddress)
                            }
                        }
                    }
                },
                payment.Asset!.Id != null
                    ? new MichelinePrim() {
                        Prim = PrimType.Some,
                        Args = new List<IMicheline>()
                        {
                            new MichelineInt(new BigInteger(payment.Asset.Id.Value)),
                        }
                    }
                    : new MichelinePrim() {
                        Prim= PrimType.None,
                    }
            }
        };
    }

    protected static BigInteger ConvertAmountToNatBigInteger(string amount) => BigInteger.Parse(amount.Replace(".", ""));
}
