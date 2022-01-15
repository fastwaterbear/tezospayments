using System;
using System.Collections.Generic;
using NUnit.Framework;
using TezosPayments.DependencyInjection;
using TezosPayments.Models;
using TezosPayments.Tests.TestHelpers;

namespace TezosPayments.Tests;

public class PaymentTestCases
{
    public const string ValidTargetAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR";
    public const string ApiEd25519SecretKey = "edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4";

    public static IEnumerable<TestCaseData> ValidCases
    {
        get
        {
            yield return SimplePayment;
        }
    }

    public static TestCaseData SimplePayment => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Simple payment signed with Ed25519 key",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = ValidTargetAddress,
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("17.170000")
        {
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            Created = DateTime.Parse("2021-08-31T11:20:23.017Z"),
            Data = new
            {
                OrderId = "103438436"
            }
        },
        () => new TestPayment()
        {
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            TargetAddress = ValidTargetAddress,
            Amount = "17.170000",
            Data = new
            {
                OrderId = "103438436"
            },
            Created = DateTime.Parse("2021-08-31T11:20:23.017Z"),
            Signature = new PaymentSignature(
                contract: "edsigu3kdsDpZY3TCptADrzLmjk7yjevXyrf73Y2iJiRyhYwQzJFTESghMoozwzuxgWsyT68SoeWL3QHPSVZvQ5uZ56Sixb86fs",
                client: null
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment?#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwiZCI6eyJvcmRlcklkIjoiMTAzNDM4NDM2In0sImMiOjE2MzA0MDg4MjMwMTcsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3Uza2RzRHBaWTNUQ3B0QURyekxtams3eWpldlh5cmY3M1kyaUppUnloWXdRekpGVEVTZ2hNb296d3p1eGdXc3lUNjhTb2VXTDNRSFBTVlp2UTV1WjU2U2l4Yjg2ZnMifX0")
        }
    );
}
