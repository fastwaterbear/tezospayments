using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace TezosPayments.Tests.TestHelpers;

public static class TestCaseHelper
{
    public static readonly IReadOnlyList<string> WhiteSpaceStrings = new List<string>()
    {
        " ", "   ", "\t\t\t"
    }.AsReadOnly();

    public static TestCaseData CreateTestCaseData<T>(
        string caseMessage,
        Func<T> caseDataFactory
    ) => new(FormatCaseMessage(caseMessage), caseDataFactory);

    public static TestCaseData CreateTestCaseData<T1, T2>(
        string caseMessage,
        Func<T1> caseData1Factory,
        Func<T2> caseData2Factory
    ) => new(FormatCaseMessage(caseMessage), caseData1Factory, caseData2Factory);

    public static TestCaseData CreateTestCaseData<T1, T2, T3>(
        string caseMessage,
        Func<T1> caseData1Factory,
        Func<T2> caseData2Factory,
        Func<T3> caseData3Factory
    ) => new(FormatCaseMessage(caseMessage), caseData1Factory, caseData2Factory, caseData3Factory);

    private static string FormatCaseMessage(string caseMessage) => $"Test Case: {caseMessage}";
}
