using Microsoft.Extensions.DependencyInjection;

namespace TezosPayments.DependencyInjection;

/// <summary>
/// TezosPayments builder Interface
/// </summary>
public interface ITezosPaymentsBuilder
{
    /// <summary>
    /// Gets the Microsoft.Extensions.DependencyInjection.IServiceCollection where TezosPayments
    /// services are configured.
    /// </summary>
    IServiceCollection Services { get; }

    /// <summary>
    /// Get lifetime of the TezosPayments services
    /// </summary>
    ServiceLifetime ServiceLifetime { get; }
};
