import { useMemo } from 'react';

import { Payment } from '@tezospayments/common';

import { PaymentField } from './PaymentField';
import './PaymentDetails.scss';

interface PaymentDetailsProps {
  readonly paymentId: string;
  readonly paymentData: Payment['data'];
}

export const PaymentDetails = (props: PaymentDetailsProps) => {
  const paymentDataFields = useMemo(() => props.paymentData && Object.keys(props.paymentData)
    .map(name => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value: any = props.paymentData?.[name];
      return (value !== undefined && typeof value !== 'object')
        ? { name, value }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        : null!;
    })
    .filter(Boolean),
    [props.paymentData]
  );

  return <div className="payment-details">
    {<>
      <h2 className="payment-details__title">Payment Data</h2>
      <table className="payment-details__fields">
        <tbody>
          <PaymentField fieldName="Payment ID" fieldValue={props.paymentId} copyButtonEnabled={true} />
          {paymentDataFields && paymentDataFields.map(paymentDataField =>
            <PaymentField
              key={paymentDataField.name}
              fieldName={paymentDataField.name}
              fieldValue={paymentDataField.value.toString()}
              copyButtonEnabled={false}
            />
          )}
        </tbody>
      </table>
    </>}
  </div>;
};
