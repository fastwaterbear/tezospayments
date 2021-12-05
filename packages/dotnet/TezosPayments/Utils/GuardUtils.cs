namespace TezosPayments.Utils;

internal static class GuardUtils
{
    public static string EnsureStringArgumentIsValid(string value, string argumentName) => !string.IsNullOrWhiteSpace(value)
        ? value
        : throw (value is null ? new ArgumentNullException(argumentName) : new ArgumentException(argumentName));
}
