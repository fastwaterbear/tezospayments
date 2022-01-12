using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TezosPayments.Serialization;

public interface IBase64PaymentSerializer : IPaymentSerializer<string>
{
}
