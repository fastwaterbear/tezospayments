using TezosPayments.Models;

namespace TezosPayments.DependencyInjection;

public record TezosPaymentsOptions
{
    public string ServiceContractAddress { get; set; } = default!;
    public string ApiSecretKey { get; set; } = default!;

    public TezosNetworkOptions? Network { get; set; }
    public string? ServiceContractDomain { get; set; }
    public PaymentUrlType? DefaultPaymentUrlType { get; set; }

    internal void Validate()
    {
        if (ServiceContractAddress == null)
            throw new Exception("The service contract address is not specified");
        if (string.IsNullOrWhiteSpace(ServiceContractAddress))
            throw new Exception($"Invalid service contract address: \"{ServiceContractAddress}\"");

        if (ApiSecretKey == null)
            throw new Exception("The API secret key is not specified");
        if (string.IsNullOrWhiteSpace(ApiSecretKey))
            throw new Exception($"Invalid API secret key: \"{ApiSecretKey}\"");

        if (ServiceContractDomain != null && string.IsNullOrWhiteSpace(ServiceContractDomain))
            throw new Exception($"Invalid service contract domain: \"{ServiceContractDomain}\"");
    }
}
