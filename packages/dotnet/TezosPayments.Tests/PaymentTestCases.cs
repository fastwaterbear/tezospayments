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
            yield return PaymentInFa12Token;
            yield return PaymentInFa2Token;
            yield return LifetimePayment;
            yield return SimplePaymentInCustomNetwork;
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

    public static TestCaseData PaymentInFa12Token => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Payment in asset tokens (FA 1.2)",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh",
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("2323232443343433743.4393343544")
        {
            Id = "2mcIVPiQ9zLnlZ-AFORvD",
            Created = DateTime.Parse("2021-09-03T10:18:23.017Z"),
            Data = new
            {
                Order = new
                {
                    Id = "d75fe06b-9288-412d-821b-ca06cd9c7e38",
                    ItemsCount = 11
                }
            },
            Asset = new PaymentAsset(
                address: "KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2",
                decimals: 11,
                id: null
            )
        },
        () => new TestPayment()
        {
            TargetAddress = "KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh",
            Id = "2mcIVPiQ9zLnlZ-AFORvD",
            Amount = "2323232443343433743.43933435440",
            Data = new
            {
                Order = new
                {
                    Id = "d75fe06b-9288-412d-821b-ca06cd9c7e38",
                    ItemsCount = 11
                }
            },
            Created = DateTime.Parse("2021-09-03T10:18:23.017Z"),
            Asset = new PaymentAsset(
                address: "KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2",
                decimals: 11,
                id: null
            ),
            Signature = new PaymentSignature(
                signingPublicKey: "edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s",
                contract: "edsigtd4BTonwv4DRCRtdpqHipCL14JUQbp9xaKidU7JZG7nCyE4tzTc2d75SyEw9qohvZocsbvgD97q8KaiKNxr8s5L2Cb5ryz",
                client: "edsigtvhosiFaUAHBgqop35hkueJ9g2B4jthjUxfwvgfe8jZW2Na1uU95749HRtcLP7JkYNFv3CbbD1D69wqRVMkrzDinW36a7D"
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh/payment#00eyJpIjoiMm1jSVZQaVE5ekxubFotQUZPUnZEIiwiYSI6IjIzMjMyMzI0NDMzNDM0MzM3NDMuNDM5MzM0MzU0NCIsInQiOiJLVDFDZ3JzUjNtY3RVRTZ3dzNCNW1xNGNqcERmbVVuSlNkTmgiLCJhcyI6eyJhIjoiS1QxTW4ySFVVS1VQZzh3aVFoVUo4WjlqVXRaTGFabjhFV0wyIiwiZCI6MTF9LCJkIjp7Im9yZGVyIjp7ImlkIjoiZDc1ZmUwNmItOTI4OC00MTJkLTgyMWItY2EwNmNkOWM3ZTM4IiwiaXRlbXNDb3VudCI6MTF9fSwiYyI6MTYzMDY2NDMwMzAxNywicyI6eyJrIjoiZWRwa3VTNG41TVpxaFJiaHFkUU5tSjVUVG5HRmZZV0JSZUY4cFNhZ29tRnlEa3BEUmMxVDZzIiwiYyI6ImVkc2lndGQ0QlRvbnd2NERSQ1J0ZHBxSGlwQ0wxNEpVUWJwOXhhS2lkVTdKWkc3bkN5RTR0elRjMmQ3NVN5RXc5cW9odlpvY3NidmdEOTdxOEthaUtOeHI4czVMMkNiNXJ5eiIsImNsIjoiZWRzaWd0dmhvc2lGYVVBSEJncW9wMzVoa3VlSjlnMkI0anRoalV4Znd2Z2ZlOGpaVzJOYTF1VTk1NzQ5SFJ0Y0xQN0prWU5GdjNDYmJEMUQ2OXdxUlZNa3J6RGluVzM2YTdEIn19")
        }
    );

    public static TestCaseData PaymentInFa2Token => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Payment in asset tokens (FA 2)",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1U2v9pECyE62NgZcYeJi4cdLKWTeiagugA",
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("94329423853995395305305.123456789")
        {
            Id = "E-aV1ZvjAP6qVCHzYnSA_",
            Created = DateTime.Parse("2021-09-03T10:18:23.017Z"),
            Asset = new PaymentAsset(
                address: "KT1DjUcNtz8pY2xL2HHfzc2Q3k9RnMuPBmV8",
                decimals: 0,
                id: null
            )
        },
        () => new TestPayment()
        {
            TargetAddress = "KT1U2v9pECyE62NgZcYeJi4cdLKWTeiagugA",
            Id = "E-aV1ZvjAP6qVCHzYnSA_",
            Amount = "94329423853995395305305",
            Created = DateTime.Parse("2021-09-03T10:18:23.017Z"),
            Asset = new PaymentAsset(
                address: "KT1DjUcNtz8pY2xL2HHfzc2Q3k9RnMuPBmV8",
                decimals: 0,
                id: null
            ),
            Signature = new PaymentSignature(
                signingPublicKey: "edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s",
                contract: "edsigth9Ctb7NBsXki5vfi7pfQmDSuCQk9QwFD6X2hc43ZejD8pqyyahuQ18XJGSq53HwPLf3tE5dQhk17pe5a1tEmctZn8griQ",
                client: null
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1U2v9pECyE62NgZcYeJi4cdLKWTeiagugA/payment#00eyJpIjoiRS1hVjFadmpBUDZxVkNIelluU0FfIiwiYSI6Ijk0MzI5NDIzODUzOTk1Mzk1MzA1MzA1IiwidCI6IktUMVUydjlwRUN5RTYyTmdaY1llSmk0Y2RMS1dUZWlhZ3VnQSIsImFzIjp7ImEiOiJLVDFEalVjTnR6OHBZMnhMMkhIZnpjMlEzazlSbk11UEJtVjgiLCJkIjowfSwiYyI6MTYzMDY2NDMwMzAxNywicyI6eyJrIjoiZWRwa3VTNG41TVpxaFJiaHFkUU5tSjVUVG5HRmZZV0JSZUY4cFNhZ29tRnlEa3BEUmMxVDZzIiwiYyI6ImVkc2lndGg5Q3RiN05Cc1hraTV2Zmk3cGZRbURTdUNRazlRd0ZENlgyaGM0M1plakQ4cHF5eWFodVExOFhKR1NxNTNId1BMZjN0RTVkUWhrMTdwZTVhMXRFbWN0Wm44Z3JpUSJ9fQ")
        }
    );

    public static TestCaseData LifetimePayment => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Lifetime payment",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh",
            ApiSecretKey = ApiEd25519SecretKey
        },
        () => new PaymentCreateParameters("0.232932843438438")
        {
            Id = "04b7a527-65b8-49ef-b8df-cb5d3ecdae07",
            Asset = new PaymentAsset(
                address: "KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2",
                decimals: 17,
                id: 1
            ),
            Created = DateTime.Parse("2021-09-03T23:23:00.000Z"),
            Expired = DateTime.Parse("2021-09-03T23:40:00.000Z")
        },
        () => new TestPayment()
        {
            TargetAddress = "KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh",
            Id = "04b7a527-65b8-49ef-b8df-cb5d3ecdae07",
            Amount = "0.23293284343843800",
            Asset = new PaymentAsset(
                address: "KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2",
                decimals: 17,
                id: 1
            ),
            Created = DateTime.Parse("2021-09-03T23:23:00.000Z"),
            Expired = DateTime.Parse("2021-09-03T23:40:00.000Z"),
            Signature = new PaymentSignature(
                signingPublicKey: "edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s",
                contract: "edsigtwjusdPHpe13gtsAzwUUTvMfgPgHBKWNjEnWXUxtV4rYEnrbdgjfQbrtUXujfyTxTTkvQvPZduvYbcxfs4uMGqrB9quEvS",
                client: null
            ),
            Url = new Uri("https://payment.tezospayments.com/KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh/payment#00eyJpIjoiMDRiN2E1MjctNjViOC00OWVmLWI4ZGYtY2I1ZDNlY2RhZTA3IiwiYSI6IjAuMjMyOTMyODQzNDM4NDM4IiwidCI6IktUMUNncnNSM21jdFVFNnd3M0I1bXE0Y2pwRGZtVW5KU2ROaCIsImFzIjp7ImEiOiJLVDFNbjJIVVVLVVBnOHdpUWhVSjhaOWpVdFpMYVpuOEVXTDIiLCJkIjoxNywiaSI6MX0sImMiOjE2MzA3MTEzODAwMDAsImUiOjE2MzA3MTI0MDAwMDAsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3R3anVzZFBIcGUxM2d0c0F6d1VVVHZNZmdQZ0hCS1dOakVuV1hVeHRWNHJZRW5yYmRnamZRYnJ0VVh1amZ5VHhUVGt2UXZQWmR1dlliY3hmczR1TUdxckI5cXVFdlMifX0")
        }
    );

    public static TestCaseData SimplePaymentInCustomNetwork => TestCaseHelper.CreateTestCaseData(
        caseMessage: "Simple payment in the custom network",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR",
            ApiSecretKey = ApiEd25519SecretKey,
            Network = new()
            {
                Name = "mycoolnetwork"
            }
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
            Url = new Uri("https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment?network=mycoolnetwork#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwidCI6IktUMU5pNHBZVjNVR1djRHA3TWdSNXByZ2NENE5DSzFNcFhpUiIsImQiOnsib3JkZXJJZCI6IjEwMzQzODQzNiJ9LCJjIjoxNjMwNDA4ODIzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd1M2tkc0RwWlkzVENwdEFEcnpMbWprN3lqZXZYeXJmNzNZMmlKaVJ5aFl3UXpKRlRFU2doTW9vend6dXhnV3N5VDY4U29lV0wzUUhQU1ZadlE1dVo1NlNpeGI4NmZzIiwiY2wiOiJlZHNpZ3RmdFA5TkgycVBlS2J1ZFJmaTUxTUNIMTJnQVlDMjQzRlRFWlRMZlZxN0taZEhWS3FZN1NwckphQnpuMVBGTTg1elJGQm02aHppRGF0WjJHMjVzODRSUGFxMVNpWVgifX0")
        }
    );
}
