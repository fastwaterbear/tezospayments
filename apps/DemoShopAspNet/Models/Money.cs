namespace DemoShopAspNet.Models;

public readonly record struct Money
{
    private readonly static Dictionary<string, string> currencySymbols = new() {
        ["XTZ"] = "ꜩ"
    };

    public decimal Value { get; }
    public string Name { get; }
    public string Symbol { get; }

    public Money(decimal value, string name)
        : this(value, name, null)
    {
    }

    public Money(decimal value, string name, string? customSymbol)
    {
        Value = value;
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Symbol = customSymbol ?? (currencySymbols.TryGetValue(name, out var symbol) ? symbol : name);
    }

    public override string ToString() => $"{Value:N2} {Symbol}";
}