
namespace TezosPayments.Tezos.Constants;

public static class Prefix
{
    public static class Text
    {
        public const string TZ1 = "tz1";
        public const string TZ2 = "tz2";
        public const string TZ3 = "tz3";
        public const string KT = "KT";
        public const string KT1 = "KT1";

        public const string EDSK2 = "edsk2";
        public const string SPSK = "spsk";
        public const string P2SK = "p2sk";

        public const string EDPK = "edpk";
        public const string SPPK = "sppk";
        public const string P2PK = "p2pk";

        public const string EDESK = "edesk";
        public const string SPESK = "spesk";
        public const string P2ESK = "p2esk";

        public const string EDSK = "edsk";
        public const string EDSIG = "edsig";
        public const string SPSIG = "spsig";
        public const string P2SIG = "p2sig";
        public const string SIG = "sig";

        public const string NET = "Net";
        public const string NCE = "nce";
        public const string B = "b";
        public const string O = "o";
        public const string LO = "Lo";
        public const string LLO = "LLo";
        public const string P = "P";
        public const string CO = "Co";
        public const string ID = "id";

        public const string EXPR = "expr";
    }

    public static class Binary
    {
        public static readonly byte[] TZ1 = new byte[] { 6, 161, 159 };
        public static readonly byte[] TZ2 = new byte[] { 6, 161, 161 };
        public static readonly byte[] TZ3 = new byte[] { 6, 161, 164 };
        public static readonly byte[] KT = new byte[] { 2, 90, 121 };
        public static readonly byte[] KT1 = new byte[] { 2, 90, 121 };

        public static readonly byte[] EDSK = new byte[] { 43, 246, 78, 7 };
        public static readonly byte[] EDSK2 = new byte[] { 13, 15, 58, 7 };
        public static readonly byte[] SPSK = new byte[] { 17, 162, 224, 201 };
        public static readonly byte[] P2SK = new byte[] { 16, 81, 238, 189 };

        public static readonly byte[] EDPK = new byte[] { 13, 15, 37, 217 };
        public static readonly byte[] SPPK = new byte[] { 3, 254, 226, 86 };
        public static readonly byte[] P2PK = new byte[] { 3, 178, 139, 127 };

        public static readonly byte[] EDESK = new byte[] { 7, 90, 60, 179, 41 };
        public static readonly byte[] SPESK = new byte[] { 0x09, 0xed, 0xf1, 0xae, 0x96 };
        public static readonly byte[] P2ESK = new byte[] { 0x09, 0x30, 0x39, 0x73, 0xab };

        public static readonly byte[] EDSIG = new byte[] { 9, 245, 205, 134, 18 };
        public static readonly byte[] SPSIG = new byte[] { 13, 115, 101, 19, 63 };
        public static readonly byte[] P2SIG = new byte[] { 54, 240, 44, 52 };
        public static readonly byte[] SIG = new byte[] { 4, 130, 43 };

        public static readonly byte[] NET = new byte[] { 87, 82, 0 };
        public static readonly byte[] NCE = new byte[] { 69, 220, 169 };
        public static readonly byte[] B = new byte[] { 1, 52 };
        public static readonly byte[] O = new byte[] { 5, 116 };
        public static readonly byte[] LO = new byte[] { 133, 233 };
        public static readonly byte[] LLO = new byte[] { 29, 159, 109 };
        public static readonly byte[] P = new byte[] { 2, 170 };
        public static readonly byte[] CO = new byte[] { 79, 179 };
        public static readonly byte[] ID = new byte[] { 153, 103 };

        public static readonly byte[] EXPR = new byte[] { 13, 44, 64, 27 };
    }
}
