import { PaymentActionType } from 'redux/actions/actionType';

const initialState = {
  paymentDetail: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case PaymentActionType.getPaymentDetail:
      return {
        ...state,
        paymentDetail: payload,
      };
    default:
      return state;
  }
};
