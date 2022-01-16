namespace TezosPayments.Utils;

public class Base64UrlPreprocessor
{
    public string PrepareEncodedValue(string base64value) => base64value
        .TrimEnd('=')
        .Replace('+', '-')
        .Replace('/', '_');

    public string PrepareValueForDecoding(string base64value)
    {
        base64value = base64value
            .Replace('_', '+')
            .Replace('_', '/');

        return (base64value.Length % 4) switch
        {
            0 => base64value,
            2 => base64value + "==",
            3 => base64value + "=",
            _ => throw new Exception("Invalid base64url value"),
        };
    }
}
