using System;
using System.Collections.Generic;
using NUnit.Framework;
using TezosPayments.DependencyInjection;
using TezosPayments.Models;
using TezosPayments.Tests.TestHelpers;

namespace TezosPayments.Tests;

public class PaymentTestCases
{
    public const string ApiEd25519SecretKey = "edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4";

    public static IEnumerable<TestCaseData> ValidCases
    {
        get
        {
            yield return SimplePayment;
            yield return PaymentWithExcessDecimals;
            yield return PaymentWithApplicationUrls;
        }
    }

    public static TestCaseData SimplePayment => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Simple payment signed with Ed25519 key",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("17.17")
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
            TargetAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            Amount = "17.170000",
            Data = new
            {
                OrderId = "103438436"
            },
            Created = DateTime.Parse("2021-08-31T11:20:23.017Z"),
            Signature = new PaymentSignature(
                signingPublicKey: "edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s",
                contract: "edsigu3kdsDpZY3TCptADrzLmjk7yjevXyrf73Y2iJiRyhYwQzJFTESghMoozwzuxgWsyT68SoeWL3QHPSVZvQ5uZ56Sixb86fs",
                client: "edsigtftP9NH2qPeKbudRfi51MCH12gAYC243FTEZTLfVq7KZdHVKqY7SprJaBzn1PFM85zRFBm6hziDatZ2G25s84RPaq1SiYX"
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwidCI6IktUMU5pNHBZVjNVR1djRHA3TWdSNXByZ2NENE5DSzFNcFhpUiIsImQiOnsib3JkZXJJZCI6IjEwMzQzODQzNiJ9LCJjIjoxNjMwNDA4ODIzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd1M2tkc0RwWlkzVENwdEFEcnpMbWprN3lqZXZYeXJmNzNZMmlKaVJ5aFl3UXpKRlRFU2doTW9vend6dXhnV3N5VDY4U29lV0wzUUhQU1ZadlE1dVo1NlNpeGI4NmZzIiwiY2wiOiJlZHNpZ3RmdFA5TkgycVBlS2J1ZFJmaTUxTUNIMTJnQVlDMjQzRlRFWlRMZlZxN0taZEhWS3FZN1NwckphQnpuMVBGTTg1elJGQm02aHppRGF0WjJHMjVzODRSUGFxMVNpWVgifX0")
        }
    );

    public static TestCaseData PaymentWithExcessDecimals => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Payment with excess decimals",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("17.123456789")
        {
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            Created = DateTime.Parse("2022-01-16T09:23:10.070Z"),
        },
        () => new TestPayment()
        {
            TargetAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            Amount = "17.123456",
            Created = DateTime.Parse("2022-01-16T09:23:10.070Z"),
            Signature = new PaymentSignature(
                signingPublicKey: "edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s",
                contract: "edsigtuATf2EHqb9UydqBZxswmfPHVAgHDrjJS1G4v4C9buwY99FtsMTehqJf4rbGBBEtRPJUP4ymykt3gzMZzYERxEytHXUojc",
                client: null
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjEyMzQ1NiIsInQiOiJLVDFOaTRwWVYzVUdXY0RwN01nUjVwcmdjRDROQ0sxTXBYaVIiLCJjIjoxNjQyMzI0OTkwMDcwLCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd0dUFUZjJFSHFiOVV5ZHFCWnhzd21mUEhWQWdIRHJqSlMxRzR2NEM5YnV3WTk5RnRzTVRlaHFKZjRyYkdCQkV0UlBKVVA0eW15a3QzZ3pNWnpZRVJ4RXl0SFhVb2pjIn19")
        }
    );

    public static TestCaseData PaymentWithApplicationUrls => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Payment with application urls",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("500")
        {
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            Created = DateTime.Parse("2021-08-31T11:40:01.000Z"),
            Data = new
            {
                Order = new
                {
                    Id = "d75fe06b-9288-412d-821b-ca06cd9c7e38"
                }
            },
            SuccessUrl = "https://fastwaterbear.com/tezospayments/test/payment/success",
            CancelUrl = "https://fastwaterbear.com/tezospayments/test/payment/cancel"
        },
        () => new TestPayment()
        {
            TargetAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            Id = "NqOzqsdqBQ_ajB0Hh2p7L",
            Amount = "500.000000",
            Data = new
            {
                Order = new
                {
                    Id = "d75fe06b-9288-412d-821b-ca06cd9c7e38"
                }
            },
            Created = DateTime.Parse("2021-08-31T11:40:01.000Z"),
            SuccessUrl = new Uri("https://fastwaterbear.com/tezospayments/test/payment/success"),
            CancelUrl = new Uri("https://fastwaterbear.com/tezospayments/test/payment/cancel"),
            Signature = new PaymentSignature(
                signingPublicKey: "edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s",
                contract: "edsigttPDNZh2rqVKiPg1tVd51BhSWhxV6qMkTuBCzzhP3QiEbrkRggT1HXt83t49SZjbXioxS5FdqNgpGQYa9ajJx2Z4R2WKrE",
                client: "edsigtaqrPMSKY841YiGtQmag8c3yaFmKqcT7XBDmb4Q59myJshtn7gsF8FMnfnoDqebqEPkZeaD3cu14xm5cPCu9oMavruPZGA"
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjUwMCIsInQiOiJLVDFOaTRwWVYzVUdXY0RwN01nUjVwcmdjRDROQ0sxTXBYaVIiLCJkIjp7Im9yZGVyIjp7ImlkIjoiZDc1ZmUwNmItOTI4OC00MTJkLTgyMWItY2EwNmNkOWM3ZTM4In19LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjMwNDEwMDAxMDAwLCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd0dFBETlpoMnJxVktpUGcxdFZkNTFCaFNXaHhWNnFNa1R1QkN6emhQM1FpRWJya1JnZ1QxSFh0ODN0NDlTWmpiWGlveFM1RmRxTmdwR1FZYTlhakp4Mlo0UjJXS3JFIiwiY2wiOiJlZHNpZ3RhcXJQTVNLWTg0MVlpR3RRbWFnOGMzeWFGbUtxY1Q3WEJEbWI0UTU5bXlKc2h0bjdnc0Y4Rk1uZm5vRHFlYnFFUGtaZWFEM2N1MTR4bTVjUEN1OW9NYXZydVBaR0EifX0")
        }
    );
}
