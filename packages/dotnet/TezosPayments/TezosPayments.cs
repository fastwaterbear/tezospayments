global using TezosPayments.Utils;
using Microsoft.Extensions.Options;
using TezosPayments.Models;
using TezosPayments.Options;
using TezosPayments.PaymentUrlFactories;
using TezosPayments.Signing.Signers;

namespace TezosPayments;

public class TezosPayments : ITezosPayments
{
    protected string ServiceContractAddress { get; }
    protected Network Network { get; }
    protected IPaymentSigner Signer { get; }
    protected IPaymentUrlFactory PaymentUrlFactory { get; }

    public TezosPayments(
        IOptions<TezosPaymentsOptions> options,
        IPaymentSigner signer,
        IPaymentUrlFactory paymentUrlFactory
    )
    {
        // TODO: validate options
        if (options?.Value == null)
            throw new ArgumentNullException(nameof(options));

        ServiceContractAddress = options.Value.ServiceContractAddress;
        Network = options.Value.Network ?? Constants.DefaultNetwork;

        Signer = signer ?? throw new ArgumentNullException(nameof(signer));
        PaymentUrlFactory = paymentUrlFactory ?? throw new ArgumentNullException(nameof(paymentUrlFactory));
    }

    public async Task<Payment> CreatePaymentAsync(PaymentCreateParameters createParameters)
    {
        if (createParameters == null)
            throw new ArgumentNullException(nameof(createParameters));

        if (createParameters.UrlType != null)
        {
            // TODO: validate default payment parameters
        }

        var payment = CreatePaymentByCreateParameters(createParameters);
        // TODO: validate payment

        await payment.SignAsync(Signer);
        await payment.CreateUrlAsync(PaymentUrlFactory, Network);

        return payment;
    }

    protected virtual Payment CreatePaymentByCreateParameters(PaymentCreateParameters createParameters)
    {
        var payment = new Payment(
            id: createParameters.Id ?? Guid.NewGuid().ToString(),
            targetAddress: ServiceContractAddress,
            amount: createParameters.Amount,
            asset: createParameters.Asset
        )
        {
            Data = createParameters.Data,
            Created = createParameters.Created,
            Expired = createParameters.Expired,
            SuccessUrl = createParameters.SuccessUrl != null ? new Uri(createParameters.SuccessUrl) : null,
            CancelUrl = createParameters.CancelUrl != null ? new Uri(createParameters.CancelUrl) : null,
        };

        return payment;
    }
}
