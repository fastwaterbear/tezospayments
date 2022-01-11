using TezosPayments.Models;

namespace TezosPayments;

public static class Constants
{
    public const string PAYMENT_APP_BASE_URL = "https://payment.tezospayments.com";

    public static readonly Network DefaultNetwork = Network.Mainnet;
    public static readonly PaymentUrlType PaymentUrlType = PaymentUrlType.Base64;
}
