import { PaymentField } from './PaymentField';
import './PaymentDetails.scss';

interface PaymentDetailsProps {
  orderId: string;
}

export const PaymentDetails = (props: PaymentDetailsProps) => {
  return <div className="payment-details">
    <h2 className="payment-details__title">Order Details</h2>
    <table className="payment-details__fields">
      <tbody>
        <PaymentField fieldName="Order ID" fieldValue={props.orderId} copyButtonEnabled={true} />
      </tbody>
    </table>
  </div>;
};
