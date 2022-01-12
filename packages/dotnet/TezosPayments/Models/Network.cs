namespace TezosPayments.Models;

public readonly record struct Network
{
    public static readonly Network Mainnet = new("NetXdQprcVkpaWU", "mainnet");
    public static readonly Network Granadanet = new("NetXz969SFaFn8k", "granadanet");
    public static readonly Network Hangzhounet = new("NetXZSsxBpMQeAT", "hangzhounet");

    private readonly string name;

    public string? Id { get; }
    public string Name { get => name ?? "Unspecified"; }

    public Network(string? id, string name)
    {
        Id = id == null ? null : GuardUtils.EnsureStringArgumentIsValid(id, nameof(id));

        this.name = GuardUtils.EnsureStringArgumentIsValid(name, nameof(name));
    }

    public static Network CreateOrGetNetwork(string name) => CreateOrGetNetwork(null, name);

    public static Network CreateOrGetNetwork(string? id, string name)
    {
        static bool IsPreDefinedNetwork(string? id, string name, Network candidate)
        {
            return name == candidate.Name && (id == null || id == candidate.Id);
        } 

        if (IsPreDefinedNetwork(id, name, Mainnet))
            return Mainnet;
        if (IsPreDefinedNetwork(id, name, Hangzhounet))
            return Hangzhounet;
        if (IsPreDefinedNetwork(id, name, Granadanet))
            return Granadanet;

        return new Network(id, name);
    }
}
