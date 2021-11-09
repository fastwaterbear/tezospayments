import React from 'react';

import { Payment } from '@tezospayments/common';

import { PaymentField } from './PaymentField';
import './PaymentDetails.scss';

interface PaymentDetailsProps {
  readonly paymentId: string;
  readonly paymentData: Payment['data'];
}

export const PaymentDetails = (props: PaymentDetailsProps) => {
  return <div className="payment-details">
    {<>
      <h2 className="payment-details__title">Payment Data</h2>
      <table className="payment-details__fields">
        <tbody>
          <PaymentField fieldName="Payment ID" fieldValue={props.paymentId} copyButtonEnabled={true} />
        </tbody>
      </table>
    </>}
  </div>;
};
