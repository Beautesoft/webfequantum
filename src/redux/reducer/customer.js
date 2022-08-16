import { CustomerActionType } from 'redux/actions/actionType';

const initialState = {
  customerDetail: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case CustomerActionType.getCustomerDetail:
      return {
        ...state,
        customerDetail: payload,
      };
    default:
      return state;
  }
};
