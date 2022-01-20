namespace TezosPayments.Utils;

public static class BytesUtils
{
    public static byte[] Combine(byte[] bytes1, byte[] bytes2)
    {
        var result = new byte[bytes1.Length + bytes2.Length];

        Buffer.BlockCopy(bytes1, 0, result, 0, bytes1.Length);
        Buffer.BlockCopy(bytes2, 0, result, bytes1.Length, bytes2.Length);

        return result;
    }

    public static byte[] Combine(byte[] bytes1, byte[] bytes2, byte[] bytes3)
    {
        var result = new byte[bytes1.Length + bytes2.Length + bytes3.Length];

        Buffer.BlockCopy(bytes1, 0, result, 0, bytes1.Length);
        Buffer.BlockCopy(bytes2, 0, result, bytes1.Length, bytes2.Length);
        Buffer.BlockCopy(bytes3, 0, result, bytes1.Length + bytes2.Length, bytes3.Length);

        return result;
    }

    public static byte[] Combine(byte[] bytes1, byte[] bytes2, byte[] bytes3, byte[] bytes4)
    {
        var result = new byte[bytes1.Length + bytes2.Length + bytes3.Length + bytes4.Length];

        Buffer.BlockCopy(bytes1, 0, result, 0, bytes1.Length);
        Buffer.BlockCopy(bytes2, 0, result, bytes1.Length, bytes2.Length);
        Buffer.BlockCopy(bytes3, 0, result, bytes1.Length + bytes2.Length, bytes3.Length);
        Buffer.BlockCopy(bytes4, 0, result, bytes1.Length + bytes2.Length + bytes3.Length, bytes4.Length);

        return result;
    }

    public static byte[] Combine(params byte[][] bytesArrays)
    {
        var result = new byte[bytesArrays.Sum(x => x.Length)];

        for (int i = 0, offset = 0; i < bytesArrays.Length; offset += bytesArrays[i].Length, i++)
            Buffer.BlockCopy(bytesArrays[i], 0, result, offset, bytesArrays[i].Length);

        return result;
    }
}
