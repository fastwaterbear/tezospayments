namespace TezosPayments.DependencyInjection;

public record TezosNetworkOptions
{
    public string? Id { get; set; }
    public string? Name { get; set; }
}
