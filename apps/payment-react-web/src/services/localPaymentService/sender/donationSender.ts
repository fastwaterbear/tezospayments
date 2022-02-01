import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet, WalletOperation } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Network, tokenWhitelistMap, TokenFA2, TokenFA12, converters } from '@tezospayments/common';
import type { Fa12Contract, Fa20Contract, TezosPaymentsServiceContract } from '@tezospayments/react-web-core';

import type { NetworkDonation } from '../../../models/payment';

export class DonationSender {
  constructor(
    protected readonly network: Network,
    protected readonly tezosToolkit: TezosToolkit,
    protected readonly tezosWallet: BeaconWallet
  ) {
  }

  async send(donation: NetworkDonation): Promise<WalletOperation> {
    const contract = await this.tezosToolkit.wallet.at<TezosPaymentsServiceContract<Wallet>>(donation.targetAddress);
    const encodedPayload = donation.payload ? converters.objectToBytes(donation.payload) : '';

    if (!donation.assetAddress)
      return this.sendNativeToken(contract, donation, encodedPayload);

    const token = tokenWhitelistMap.get(this.network)?.get(donation.assetAddress);
    if (!token || !token.metadata)
      throw new Error('Token not found');

    const tokenAmount = converters.tokensAmountToNat(donation.amount, token.metadata.decimals);

    return token.type === 'fa1.2'
      ? this.sendFa12Token(contract, tokenAmount, token, encodedPayload)
      : this.sendFa20Token(contract, tokenAmount, token, encodedPayload);
  }

  private sendNativeToken(
    contract: TezosPaymentsServiceContract<Wallet>,
    donation: Omit<NetworkDonation, 'payload'>,
    encodedPayload: string
  ): Promise<TransactionWalletOperation> {
    return contract.methodsObject.send_donation({
      payload: encodedPayload
    }).send({ amount: donation.amount });
  }

  private async sendFa12Token(
    contract: TezosPaymentsServiceContract<Wallet>,
    tokenAmount: BigNumber,
    token: TokenFA12,
    encodedPayload: string,
  ): Promise<WalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa12Contract<Wallet>>(token.contractAddress);

    return await this.tezosToolkit.wallet.batch()
      .withContractCall(tokenContract.methods.approve(contract.address, tokenAmount))
      .withContractCall(
        contract.methodsObject.send_donation({
          payload: encodedPayload,
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
    tokenAmount: BigNumber,
    token: TokenFA2,
    encodedPayload: string,
  ): Promise<WalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa20Contract<Wallet>>(token.contractAddress);
    const userAddress = await this.tezosToolkit.wallet.pkh({ forceRefetch: true });

    return await this.tezosToolkit.wallet.batch()
      .withContractCall(tokenContract.methods.update_operators([{
        add_operator: {
          owner: userAddress,
          operator: contract.address,
          token_id: token.id
        }
      }]))
      .withContractCall(
        contract.methodsObject.send_donation({
          payload: encodedPayload,
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
