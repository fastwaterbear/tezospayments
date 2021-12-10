import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet, WalletOperation } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Network, tokenWhitelistMap, TokenFA2, TokenFA12, converters } from '@tezospayments/common';
import type { Fa12Contract, Fa20Contract, TezosPaymentsServiceContract } from '@tezospayments/react-web-core';

import type { NetworkPayment } from '../../../models/payment';

export class PaymentSender {
  constructor(
    protected readonly network: Network,
    protected readonly tezosToolkit: TezosToolkit,
    protected readonly tezosWallet: BeaconWallet
  ) {
  }

  async send(payment: NetworkPayment): Promise<WalletOperation> {
    const contract = await this.tezosToolkit.wallet.at<TezosPaymentsServiceContract<Wallet>>(payment.targetAddress);

    if (!payment.asset)
      return this.sendNativeToken(contract, payment);

    const token = tokenWhitelistMap.get(this.network)?.get(payment.asset.address);
    if (!token || !token.metadata)
      throw new Error('Token not found');

    const tokenAmount = converters.tokensAmountToNat(payment.amount, token.metadata.decimals);

    return token.type === 'fa1.2'
      ? this.sendFa12Token(contract, payment, tokenAmount, token)
      : this.sendFa20Token(contract, payment, tokenAmount, token);
  }

  private sendNativeToken(
    contract: TezosPaymentsServiceContract<Wallet>,
    payment: NetworkPayment
  ): Promise<TransactionWalletOperation> {
    return contract.methodsObject.send_payment({
      id: payment.id,
      signature: payment.signature
    }).send({ amount: payment.amount });
  }

  private async sendFa12Token(
    contract: TezosPaymentsServiceContract<Wallet>,
    payment: Omit<NetworkPayment, 'amount'>,
    tokenAmount: BigNumber,
    token: TokenFA12,
  ): Promise<WalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa12Contract<Wallet>>(token.contractAddress);

    return await this.tezosToolkit.wallet.batch()
      .withContractCall(tokenContract.methods.approve(contract.address, tokenAmount))
      .withContractCall(
        contract.methodsObject.send_payment({
          id: payment.id,
          signature: payment.signature,
          asset_value: {
            token_address: token.contractAddress,
            token_id: null,
            value: tokenAmount.toString(10)
          }
        })
      ).send();
  }

  private async sendFa20Token(
    contract: TezosPaymentsServiceContract<Wallet>,
    payment: Omit<NetworkPayment, 'amount'>,
    tokenAmount: BigNumber,
    token: TokenFA2
  ): Promise<WalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa20Contract<Wallet>>(token.contractAddress);
    const userAddress = await this.tezosToolkit.wallet.pkh();

    return await this.tezosToolkit.wallet.batch()
      .withContractCall(tokenContract.methods.update_operators([{
        add_operator: {
          owner: userAddress,
          operator: contract.address,
          token_id: token.id
        }
      }]))
      .withContractCall(
        contract.methodsObject.send_payment({
          id: payment.id,
          signature: payment.signature,
          asset_value: {
            token_address: token.contractAddress,
            token_id: token.id,
            value: tokenAmount.toString(10)
          }
        })
      )
      .withContractCall(tokenContract.methods.update_operators([{
        remove_operator: {
          owner: userAddress,
          operator: contract.address,
          token_id: token.id
        }
      }]))
      .send();
  }
}
