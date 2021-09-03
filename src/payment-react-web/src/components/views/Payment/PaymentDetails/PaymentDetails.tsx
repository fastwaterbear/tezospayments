import React from 'react';

import { Payment } from '@tezospayments/common';

import { PaymentField } from './PaymentField';
import './PaymentDetails.scss';

interface PaymentDetailsProps {
  readonly paymentData: Payment['data']
}

export const PaymentDetails = (props: PaymentDetailsProps) => {
  return <div className="payment-details">
    {Payment.publicDataExists(props.paymentData) && <>
      <h2 className="payment-details__title">Payment Public Data</h2>
      <table className="payment-details__fields">
        <tbody>
          <PaymentField fieldName="Order ID" fieldValue={(props.paymentData.public.orderId as string)} copyButtonEnabled={true} />
        </tbody>
      </table>
    </>}
  </div>;
};
