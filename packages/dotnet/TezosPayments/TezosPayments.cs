global using TezosPayments.Utils;

using TezosPayments.Models;
using TezosPayments.Options;
using TezosPayments.PaymentUrlFactories;
using TezosPayments.Serialization;
using TezosPayments.Signing.Signers;
using TezosPayments.Signing.SignPayloadEncoding;

namespace TezosPayments;

public class TezosPayments : ITezosPayments
{
    public string ServiceContractAddress { get; }
    public Network Network { get; }
    protected IDefaultPaymentParameters? DefaultPaymentParameters { get; }

    protected IPaymentSigner Signer { get; }
    protected IPaymentUrlFactoryProvider PaymentUrlFactoryProvider { get; }

    public TezosPayments(
        string serviceContractAddress,
        string apiSecretKey,
        TezosPaymentDefaultOptions? defaultOptions = default,
        DefaultPaymentParameters? defaultPaymentParameters = default
     ) : this(
            serviceContractAddress,
            defaultOptions,
            defaultPaymentParameters,
            new ApiSecretKeyPaymentSigner(apiSecretKey, new PaymentSignPayloadEncoder()),
            new ProxyPaymentUrlFactoryProvider(new Base64PaymentUrlFactory(new Base64JsonPaymentSerializer()))
        )
    {
    }

    public TezosPayments(
        string serviceContractAddress,
        IPaymentSigner signer,
        IPaymentUrlFactoryProvider paymentUrlFactoryProvider
    ) : this(serviceContractAddress, null, null, signer, paymentUrlFactoryProvider)
    {
    }

    public TezosPayments(
        string serviceContractAddress,
        TezosPaymentDefaultOptions defaultOptions,
        IPaymentSigner signer,
        IPaymentUrlFactoryProvider paymentUrlFactoryProvider
    ) : this(serviceContractAddress, defaultOptions, null, signer, paymentUrlFactoryProvider)
    {
    }

    public TezosPayments(
        string serviceContractAddress,
        DefaultPaymentParameters defaultPaymentParameters,
        IPaymentSigner signer,
        IPaymentUrlFactoryProvider paymentUrlFactoryProvider
    ) : this(serviceContractAddress, null, defaultPaymentParameters, signer, paymentUrlFactoryProvider)
    {
    }

    public TezosPayments(
        string serviceContractAddress,
        TezosPaymentDefaultOptions? defaultOptions,
        DefaultPaymentParameters? defaultPaymentParameters,
        IPaymentSigner signer,
        IPaymentUrlFactoryProvider paymentUrlFactoryProvider
    )
    {
        ServiceContractAddress = GuardUtils.EnsureStringArgumentIsValid(serviceContractAddress, nameof(serviceContractAddress));

        // TODO: validate options
        Network = defaultOptions?.Network ?? Constants.DefaultNetwork;
        DefaultPaymentParameters = defaultPaymentParameters != null ? defaultPaymentParameters with { } : null;

        Signer = signer ?? throw new ArgumentNullException(nameof(signer));
        PaymentUrlFactoryProvider = paymentUrlFactoryProvider ?? throw new ArgumentNullException(nameof(paymentUrlFactoryProvider));
    }

    public async Task<IPayment> CreatePaymentAsync(PaymentCreateParameters createParameters)
    {
        if (createParameters.UrlType != null)
        {
            // TODO: validate default payment parameters
        }

        var payment = CreatePaymentByCreateParameters(createParameters);
        // TODO: validate payment

        await payment.SignAsync(Signer);
        await payment.CreateUrlAsync(GetPaymentUrlFactory(createParameters), Network);

        return payment;
    }

    protected virtual Payment CreatePaymentByCreateParameters(PaymentCreateParameters createParameters)
    {
        var payment = new Payment(
            id: createParameters.Id ?? Guid.NewGuid().ToString(),
            targetAddress: ServiceContractAddress,
            amount: createParameters.Amount,
            asset: createParameters.Asset,
            created: createParameters.Created
        )
        {
            Data = createParameters.Data,
            Expired = createParameters.Expired,
            SuccessUrl = createParameters.SuccessUrl != null ? new Uri(createParameters.SuccessUrl) : null,
            CancelUrl = createParameters.CancelUrl != null ? new Uri(createParameters.CancelUrl) : null,
        };

        return payment;
    }

    protected IPaymentUrlFactory GetPaymentUrlFactory(PaymentCreateParameters createParameters)
    {
        return PaymentUrlFactoryProvider.GetPaymentUrlFactory(
            createParameters.UrlType ?? DefaultPaymentParameters?.UrlType ?? Constants.PaymentUrlType
        );
    }
}
