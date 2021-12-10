import { NextApiHandler } from 'next';
import { TezosPayments } from 'tezospayments';

import { products, paymentAssetMetadata } from '../../data';

const tezosPayments = new TezosPayments({
  serviceContractAddress: process.env.TEZOSPAYMENTS_SERVICE_CONTRACT_ADDRESS,
  signing: {
    apiSecretKey: process.env.TEZOSPAYMENTS_API_KEY
  },
  defaultPaymentParameters: {
    network: process.env.TEZOSPAYMENTS_NETWORK_NAME ? { name: process.env.TEZOSPAYMENTS_NETWORK_NAME } : undefined
  }
});

const handler: NextApiHandler = async (req, res) => {
  const requestedBodyId = req.body?.productId;
  const product = products.find(product => product.id === req.body?.productId);
  if (!product) {
    res.status(404).end(`Product not found by ${requestedBodyId}`);
    return;
  }

  const amount = product.price[0];
  const currency = product.price[1];

  const payment = await tezosPayments.createPayment({
    amount: amount.toString(),
    asset: currency !== 'XTZ' ? paymentAssetMetadata.get(currency) : undefined,
    data: {
      Product: product.name
    },
  });

  res.status(200).end(payment.url);
};

export default handler;
