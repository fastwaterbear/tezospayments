using System.Text;

namespace TezosPayments.Utils;

public static class TextUtils
{
    public static readonly Base64UrlPreprocessor Base64UrlPreprocessor = new();

    public static string EncodeToBase64Url(string value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));

        var encodedValue = Convert.ToBase64String(Encoding.UTF8.GetBytes(value));

        return Base64UrlPreprocessor.PrepareEncodedValue(encodedValue);
    }

    public static string DecodeFromBase64Url(string value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));

        var preparedValue = Base64UrlPreprocessor.PrepareValueForDecoding(value);

        return Encoding.UTF8.GetString(Convert.FromBase64String(preparedValue));
    }
}
