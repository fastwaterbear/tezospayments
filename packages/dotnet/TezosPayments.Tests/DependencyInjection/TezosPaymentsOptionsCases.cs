using System;
using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using TezosPayments.Tests.TestHelpers;

namespace TezosPayments.DependencyInjection.Tests;

public static class TezosPaymentsOptionsCases
{
    public const string ApiSecretKey = "edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4";
    public const string ServiceContractAddress = "KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR";

    public static IEnumerable<TestCaseData> InvalidCases
    {
        get
        {
            yield return MissingTezosPaymentsOptions;

            yield return MissingServiceContractAddress;
            yield return ServiceContractAddressIsEmpty;
            foreach (var testCase in ServiceContractAddressIsInvalid)
                yield return testCase;

            yield return MissingApiSecretKey;
            yield return ApiSecretKeyIsEmpty;
            foreach (var testCase in ServiceContractDomainIsInvalid)
                yield return testCase;

            yield return ServiceContractDomainIsEmpty;
            foreach (var testCase in ServiceContractDomainIsInvalid)
                yield return testCase;
        }
    }

    public static TestCaseData MissingTezosPaymentsOptions => TestCaseHelper.CreateTestCaseData(
        caseMessage: $"The instance of {nameof(TezosPaymentsOptions)} is null",
        () => (TezosPaymentsOptions?)null,
        () => Throws.InstanceOf<ArgumentNullException>().With.Message.Contains("options").IgnoreCase
    );

    public static TestCaseData MissingServiceContractAddress => TestCaseHelper.CreateTestCaseData(
        caseMessage: "The service contract address is null",
        () => new TezosPaymentsOptions()
        {
            ApiSecretKey = ApiSecretKey
        },
        () => Throws.Exception.With.Message.Contains("service contract address is not specified").IgnoreCase
    );

    public static TestCaseData ServiceContractAddressIsEmpty => TestCaseHelper.CreateTestCaseData(
        caseMessage: "The service contract address is empty",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = string.Empty,
            ApiSecretKey = ApiSecretKey
        },
        () => Throws.Exception.With.Message.Contains("invalid service contract address").IgnoreCase
            .And.With.Message.Contains("\"\"").IgnoreCase
    );

    public static IEnumerable<TestCaseData> ServiceContractAddressIsInvalid => TestCaseHelper.WhiteSpaceStrings
        .Select(invalidServiceContractAddress => TestCaseHelper.CreateTestCaseData(
            caseMessage: $"The service contract address is invalid: \"{invalidServiceContractAddress}\"",
            () => new TezosPaymentsOptions()
            {
                ServiceContractAddress = invalidServiceContractAddress,
                ApiSecretKey = ApiSecretKey
            },
            () => Throws.Exception.With.Message.Contains("invalid service contract address").IgnoreCase
                .And.With.Message.Contains($"\"{invalidServiceContractAddress}\"").IgnoreCase
        )
    );

    public static TestCaseData MissingApiSecretKey => TestCaseHelper.CreateTestCaseData(
        caseMessage: "The API secret key is null",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = ServiceContractAddress
        },
        () => Throws.Exception.With.Message.Contains("API secret key is not specified").IgnoreCase
    );

    public static TestCaseData ApiSecretKeyIsEmpty => TestCaseHelper.CreateTestCaseData(
        caseMessage: "The API secret key is empty",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = ServiceContractAddress,
            ApiSecretKey = string.Empty
        },
        () => Throws.Exception.With.Message.Contains("invalid API secret key").IgnoreCase
            .And.With.Message.Contains("\"\"").IgnoreCase
    );

    public static IEnumerable<TestCaseData> ApiSecretKeyIsInvalid => TestCaseHelper.WhiteSpaceStrings
        .Select(invalidApiSecretKey => TestCaseHelper.CreateTestCaseData(
            caseMessage: $"The API secret key is invalid: \"{invalidApiSecretKey}\"",
            () => new TezosPaymentsOptions()
            {
                ServiceContractAddress = ServiceContractAddress,
                ApiSecretKey = invalidApiSecretKey
            },
            () => Throws.Exception.With.Message.Contains("invalid API secret key").IgnoreCase
                .And.With.Message.Contains($"\"{invalidApiSecretKey}\"").IgnoreCase
        )
    );

    public static TestCaseData ServiceContractDomainIsEmpty => TestCaseHelper.CreateTestCaseData(
        caseMessage: "The service contract domain is empty",
        () => new TezosPaymentsOptions()
        {
            ServiceContractAddress = ServiceContractAddress,
            ApiSecretKey = ApiSecretKey,
            ServiceContractDomain = string.Empty
        },
        () => Throws.Exception.With.Message.Contains("invalid service contract domain").IgnoreCase
            .And.With.Message.Contains("\"\"").IgnoreCase
    );

    public static IEnumerable<TestCaseData> ServiceContractDomainIsInvalid => TestCaseHelper.WhiteSpaceStrings
        .Select(invalidServiceContractDomain => TestCaseHelper.CreateTestCaseData(
            caseMessage: $"The service contract domain is invalid: \"{invalidServiceContractDomain}\"",
            () => new TezosPaymentsOptions()
            {
                ServiceContractAddress = ServiceContractAddress,
                ApiSecretKey = ApiSecretKey,
                ServiceContractDomain = invalidServiceContractDomain
            },
            () => Throws.Exception.With.Message.Contains("invalid service contract domain").IgnoreCase
                .And.With.Message.Contains($"\"{invalidServiceContractDomain}\"").IgnoreCase
        )
    );
}
