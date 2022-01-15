using System.Numerics;
using System.Text;
using System.Text.Json;
using Netezos.Encoding;
using Netezos.Forging;
using TezosPayments.Models;

namespace TezosPayments.Signing.SignPayloadEncoding;

public class PaymentSignPayloadEncoder : IPaymentSignPayloadEncoder
{
    private const byte CONTRACT_SIGN_PAYLOAD_PREFIX_BYTE = 5;

    protected JsonSerializerOptions JsonSerializerOptions = new()
    {
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    public EncodedPaymentSignPayload Encode(Payment payment)
    {
        return new(GetContractSignPayload(payment), null);
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
            SuccessUrl = payment.SuccessUrl?.AbsoluteUri,
            CancelUrl = payment.CancelUrl?.AbsoluteUri,
            Data = payment.Data,
        };
        if (clientSignPayload.IsEmpty)
            return null;

        var clientSignPayloadString = JsonSerializer.Serialize(clientSignPayload, JsonSerializerOptions);
        return Encoding.UTF8.GetBytes(clientSignPayloadString);
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
                        Prim = PrimType.Pair,
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

    protected static BigInteger ConvertAmountToNatBigInteger(string amount)
        => BigInteger.Parse(amount.ToString().Replace(".", ""));
}
