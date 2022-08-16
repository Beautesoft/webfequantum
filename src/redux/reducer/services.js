import { ServicesActionType } from 'redux/actions/actionType';

const initialState = {
  servicesDetail: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case ServicesActionType.getServicesDetail:
      return {
        ...state,
        servicesDetail: payload,
      };
    default:
      return state;
  }
};
