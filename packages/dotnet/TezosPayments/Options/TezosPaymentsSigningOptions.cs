namespace TezosPayments.Options;

public interface ITezosPaymentsSigningOptions
{
}

public record TezosPaymentsApiSigningOptions(string ApiSecretKey) : ITezosPaymentsSigningOptions;

public record TezosPaymentsWalletSigningOptions(Func<byte[], Task<string>> WalletSigning): ITezosPaymentsSigningOptions;
