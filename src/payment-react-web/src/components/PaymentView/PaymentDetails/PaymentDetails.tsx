import { PaymentField } from './PaymentField';
import './PaymentDetails.scss';

interface PaymentDetailsProps {
  readonly publicData: {
    readonly orderId: string;
  }
}

export const PaymentDetails = (props: PaymentDetailsProps) => {
  return <div className="payment-details">
    <h2 className="payment-details__title">Payment Public Data</h2>
    <table className="payment-details__fields">
      <tbody>
        <PaymentField fieldName="Order ID" fieldValue={props.publicData.orderId} copyButtonEnabled={true} />
      </tbody>
    </table>
  </div>;
};
