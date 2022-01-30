import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, Wallet, WalletOperation, TransferParams } from '@taquito/taquito';
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

  async send(payment: NetworkPayment, initialTransfers?: TransferParams[]): Promise<WalletOperation> {
    const contract = await this.tezosToolkit.wallet.at<TezosPaymentsServiceContract<Wallet>>(payment.targetAddress);

    if (!payment.asset)
      return this.sendNativeToken(contract, payment, initialTransfers);

    const token = tokenWhitelistMap.get(this.network)?.get(payment.asset.address);
    if (!token || !token.metadata)
      throw new Error('Token not found');

    const tokenAmount = converters.tokensAmountToNat(payment.amount, token.metadata.decimals);

    return token.type === 'fa1.2'
      ? this.sendFa12Token(contract, payment, tokenAmount, token, initialTransfers)
      : this.sendFa20Token(contract, payment, tokenAmount, token, initialTransfers);
  }

  private sendNativeToken(
    contract: TezosPaymentsServiceContract<Wallet>,
    payment: NetworkPayment,
    initialTransfers?: TransferParams[]
  ): Promise<WalletOperation> {
    const batch = this.tezosToolkit.wallet.batch();
    initialTransfers?.forEach(t => batch.withTransfer(t));

    return batch.withTransfer(
      contract.methodsObject.send_payment({
        id: payment.id,
        signature: payment.signature
      }).toTransferParams({ amount: payment.amount.toNumber() })
    ).send();
  }

  private async sendFa12Token(
    contract: TezosPaymentsServiceContract<Wallet>,
    payment: Omit<NetworkPayment, 'amount'>,
    tokenAmount: BigNumber,
    token: TokenFA12,
    initialTransfers?: TransferParams[]
  ): Promise<WalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa12Contract<Wallet>>(token.contractAddress);
    const batch = this.tezosToolkit.wallet.batch();
    initialTransfers?.forEach(t => batch.withTransfer(t));

    return batch
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
    token: TokenFA2,
    initialTransfers?: TransferParams[]
  ): Promise<WalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa20Contract<Wallet>>(token.contractAddress);
    const userAddress = await this.tezosToolkit.wallet.pkh({ forceRefetch: true });
    const batch = this.tezosToolkit.wallet.batch();
    initialTransfers?.forEach(t => batch.withTransfer(t));

    return batch
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
