namespace TezosPayments.Models;

public readonly record struct Network
{
    public string? Id { get; }
    public string Name { get; }

    public Network(string? id, string name)
    {
        Id = id is null ? null : GuardUtils.EnsureStringArgumentIsValid(id, nameof(id));
        Name = GuardUtils.EnsureStringArgumentIsValid(name, nameof(name));
    }
}
