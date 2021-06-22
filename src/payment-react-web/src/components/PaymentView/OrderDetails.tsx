import { CopyOutlined } from '@ant-design/icons';

import './OrderDetails.scss';

export const OrderDetails = () => {
  return <div className="order-details">
    <h2 className="order-details__title">Order Details</h2>
    <table className="order-fields">
      <tbody>
        <tr className="order-field">
          <td className="order-field__label">Order Id</td>
          <td className="order-field__value-container">
            <span className="order-field__value">bcd07c712e744e708d9a9a3183b31233</span>
            <button className="order-field__copy-button">
              <CopyOutlined className="order-field__copy-icon" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>;
};
