import { CopyButtonPure } from '../../../common';
import './PaymentField.scss';

interface PaymentFieldProps {
  fieldName: string;
  fieldValue: string | number;
  copyButtonEnabled: boolean;
}

type DefaultPaymentFieldProps = Required<Pick<PaymentFieldProps, 'copyButtonEnabled'>>;

export const defaultProps: DefaultPaymentFieldProps = {
  copyButtonEnabled: false
};

export const PaymentField = (props: PaymentFieldProps) => {
  return <tr className="payment-field">
    <td className="payment-field__label">{props.fieldName}</td>
    <td>
      <span className="payment-field__value">{props.fieldValue}</span>
      {props.copyButtonEnabled && <CopyButtonPure copyText={props.fieldValue.toString()} />}
    </td>
  </tr>;
};
PaymentField.defaultProps = defaultProps;
