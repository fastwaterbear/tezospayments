using System.Text;

namespace TezosPayments.Utils;

public static class TextUtils
{
    public static readonly Base64UrlPreprocessor Base64UrlPreprocessor = new();

    public static string EncodeToBase64Url(string value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));

        var preparedValue = Base64UrlPreprocessor.PrepareEncodedValue(value);

        return Convert.ToBase64String(Encoding.UTF8.GetBytes(preparedValue));
    }

    public static string DecodeFromBase64Url(string value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));

        var preparedValue = Base64UrlPreprocessor.PrepareValueForDecoding(value);

        return Encoding.UTF8.GetString(Convert.FromBase64String(preparedValue));
    }
}
